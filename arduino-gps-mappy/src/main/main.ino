//Import Libraries
#include "LiquidCrystal_I2C.h"
#include <string.h>
#include "TinyGPSPlus.h"

//Pins Define
#define blueTopPin 7
#define blueBottomPin 6
#define redTopPin 5
#define redBottomPin 4
#define soundPin 24
#define lcdSDA 20
#define lcdSCL 21

//Tone Define
#define OKFreq 1600
#define PROCESSFreq 1200
#define ERRORFreq 800

//Microcode Constants
#define microCodeEOC ';'
#define microCodeSEP '/'

//GPS Constants
#define gpsAvg 10

//Host-Micro Protocol
#define microSend (char)0b00000001
#define microEnd (char)0b000000010
#define microReceived (char)0b00000011
#define microError (char)0b00000100

#define hostSend (char)0b10000001
#define hostEnd (char)0b10000010
#define hostReceived (char)0b10000011
#define hostError (char)0b10000100

#define gpsInf (char)0b11000001

#define ioCnct (char)0b11100001

#define logSend (char)0b11010001
#define logRqst (char)0b11010010
#define logRecv (char)0b11010011

#define msgTimeout 5000

//Other
#define idleLimit 5000

//Button States
//|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
//| btc | bbc | rtc | rbc | btp | bbp | rtp | rbp |
byte btnStates = 0;
bool soundEnable = true;

char serialBuf;
//GPS Buffer
char GPSBuf;
double GPSLat = 0;
double GPSLon = 0;
bool GPSInit = false;
bool beepLock = true;
bool GPSOn = false;
bool beepLockNd = true;
TinyGPSPlus gpsParser;
//LiquidCrystal
LiquidCrystal_I2C lcd(0x27, 16, 2);

enum ProgState {
  MAIN_MENU,  //0

  GPS_MENU,     //1
  IO_MENU,      //2
  UTILS_MENU,   //3
  SECRET_MENU,  //4

  GPS_START,    //5
  GPS_LOG,      //6
  GPS_DUMP,     //7
  EMPTY_SLOT2,  //8

  IO_CONNECT,   //9
  IO_LOG,       //10
  EMPTY_SLOT3,  //11
  EMPTY_SLOT4,  //12

  PROG_LOG,     //13
  EMPTY_SLOT7,  //14
  EMPTY_SLOT5,  //15
  EMPTY_SLOT6,  //16

  BAD_APPLE,     //17
  EMPTY_SLOT8,   //18
  EMPTY_SLOT9,   //19
  EMPTY_SLOT10,  //20

  GPS_NEW,  //21

  UNKNOWNSTATE,  //22
};
ProgState progStateStrToEnum(const char* str) {
  if (strcmp(str, "MAIN_MENU") == 0) return MAIN_MENU;

  if (strcmp(str, "GPS_MENU") == 0) return GPS_MENU;
  if (strcmp(str, "IO_MENU") == 0) return IO_MENU;
  if (strcmp(str, "UTILS_MENU") == 0) return UTILS_MENU;
  if (strcmp(str, "SECRET_MENU") == 0) return SECRET_MENU;

  if (strcmp(str, "GPS_START") == 0) return GPS_START;
  if (strcmp(str, "GPS_LOG") == 0) return GPS_LOG;
  if (strcmp(str, "GPS_DUMP") == 0) return GPS_DUMP;
  if (strcmp(str, "EMPTY_SLOT2") == 0) return EMPTY_SLOT2;

  if (strcmp(str, "IO_CONNECT") == 0) return IO_CONNECT;
  if (strcmp(str, "IO_LOG") == 0) return IO_LOG;
  if (strcmp(str, "EMPTY_SLOT3") == 0) return EMPTY_SLOT3;
  if (strcmp(str, "EMPTY_SLOT4") == 0) return EMPTY_SLOT4;

  if (strcmp(str, "EMPTY_SLOT7") == 0) return EMPTY_SLOT7;
  if (strcmp(str, "PROG_LOG") == 0) return PROG_LOG;
  if (strcmp(str, "EMPTY_SLOT5") == 0) return EMPTY_SLOT5;
  if (strcmp(str, "EMPTY_SLOT6") == 0) return EMPTY_SLOT6;

  if (strcmp(str, "BAD_APPLE") == 0) return BAD_APPLE;
  if (strcmp(str, "EMPTY_SLOT8") == 0) return EMPTY_SLOT8;
  if (strcmp(str, "EMPTY_SLOT9") == 0) return EMPTY_SLOT9;
  if (strcmp(str, "EMPTY_SLOT10") == 0) return EMPTY_SLOT10;

  if (strcmp(str, "GPS_NEW") == 0) return GPS_NEW;

  return UNKNOWNSTATE;
}
enum MicroCode {
  GO_TO__,
  EXEC___,
  IO_SEND,
  NOTHING,
  UNKNOWNCODE,
};
int microCodeStrToEnum(const char* str) {
  if (strcmp(str, "GO_TO__") == 0) return GO_TO__;
  if (strcmp(str, "EXEC___") == 0) return EXEC___;
  if (strcmp(str, "IO_SEND") == 0) return IO_SEND;
  if (strcmp(str, "NOTHING") == 0) return NOTHING;
  return UNKNOWNCODE;
}
enum SubMicroCode {
  APL,
  GET_GPS,
  SOUND_TOGGLE,
  DUMP_GPS,
  UNKNOWNSUBCODE,
};
int subCodeStrToEnum(const char* str) {
  if (strcmp(str, "APL") == 0) return APL;
  if (strcmp(str, "GET_GPS") == 0) return GET_GPS;
  if (strcmp(str, "SOUND_TOGGLE") == 0) return SOUND_TOGGLE;
  if (strcmp(str, "DUMP_GPS") == 0) return DUMP_GPS;
  return UNKNOWNSUBCODE;
}

ProgState programState = MAIN_MENU;
//Quadary Tree Containing Microcode
const char* microCodeSetTree[23][9] = {
  { "GO_TO__ GPS_MENU;", "GO_TO__ IO_MENU;", "GO_TO__ UTILS_MENU;", "GO_TO__ SECRET_MENU;", "Mappy", "GPS", "IO", "UTILS", "_" },  //Main Menu 0

  { "GO_TO__ GPS_START;", "GO_TO__ GPS_LOG/IO_SEND RQST_GPS_LOG;", "GO_TO__ GPS_DUMP;", "GO_TO__ MAIN_MENU;", "GPS", "Map", "Log", "Dump", "<" },  //GPS Menu 1
  { "GO_TO__ IO_CONNECT/IO_SEND CNCTMSG;", "GO_TO__ IO_LOG/IO_SEND RQST_IO_LOG;", "NOTHING;", "GO_TO__ MAIN_MENU;", "IO", "Conct", "Log", "_", "<" },               //IO Menu 2
  { "GO_TO__ PROG_LOG/IO_SEND RQST_PROG_LOG;", "EXEC___ SOUND_TOGGLE;", "NOTHING;", "GO_TO__ MAIN_MENU;", "UTILS", "PLog", "Sound", "_", "<" },                     //UTILS Menu 3
  { "GO_TO__ BAD_APPLE;", "NOTHING;", "NOTHING;", "GO_TO__ MAIN_MENU;", "Secrets", "badapl", "_", "_", "<" },                                                       //Secret Menu 4

  { "GO_TO__ GPS_NEW/IO_SEND GPS_NEW;", "NOTHING;", "NOTHING;", "GO_TO__ GPS_MENU;", "Mapping", "New", "_", "_", "<" },  //GPS Start 5
  { "NOTHING;", "NOTHING;", "NOTHING;", "GO_TO__ GPS_MENU;", "Log", "_", "_", "_", "<" },                                //GPS Log 6
  { "NOTHING;", "NOTHING;", "NOTHING;", "GO_TO__ GPS_MENU;", "Dumping GPS", "_", "_", "_", "<" },                        //Nothing 7
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                                           //Nothing 8

  { "NOTHING;", "NOTHING;", "NOTHING;", "GO_TO__ IO_MENU;", "STATUS: IDK", "_", "_", "_", "<" },  //IO Connect 9
  { "NOTHING;", "NOTHING;", "NOTHING;", "GO_TO__ IO_MENU;", "Log", "_", "_", "_", "<" },          //IO Log 10
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                    //Nothing 11
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                    //Nothing 12

  { "NOTHING;", "NOTHING;", "NOTHING;", "GO_TO__ UTILS_MENU;", "Prog Log", "_", "_", "_", "<" },  //PROG Log 13
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "<" },                    //Nothing 14
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                    //Nothing 15
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                    //Nothing 16

  { "EXEC___ APL;", "NOTHING;", "NOTHING;", "GO_TO__ SECRET_MENU;", "Bad Apple", ">", "H", "_", "<" },  //Nothing 17
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                          //Nothing 18
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                          //Nothing 19
  { "NOTHING;", "NOTHING;", "NOTHING;", "NOTHING;", "_", "_", "_", "_", "_" },                          //Nothing 20

  { "EXEC___ GET_GPS;", "IO_SEND GPS_END/GO_TO__ GPS_START;", "IO_SEND GPS_CANCL/GO_TO__ GPS_START;", "NOTHING;", "Polygon", "Mark", "End", "Cancel", "_" },  //GPS Start 21

  { "GO_TO__ MAIN_MENU;", "GO_TO__ MAIN_MENU;", "GO_TO__ MAIN_MENU;", "GO_TO__ MAIN_MENU;", "UNKNOWN", "_", "_", "_", "_" },  //Nothing 22
};

inline void debounceBtn(int btnPin, void (*parseCallback)(int)) {
  //write to 4 bit current state of the pin
  btnStates = digitalRead(btnPin) ? btnStates | (1 << btnPin) : btnStates & ~(1 << btnPin);
  //if current state is different from previous state, and isnt released
  if (((btnStates >> btnPin) & 1) != ((btnStates >> btnPin - 4) & 1) && ((btnStates >> btnPin) & 1) != LOW) {
    parseCallback(btnPin);
    //Serial.println("-------------\n");
  }
  //write the current of the pin to 4 bit previous state of the pin
  btnStates = ((btnStates >> btnPin) & 1) ? btnStates | (1 << btnPin - 4) : btnStates & ~(1 << btnPin - 4);
}

//Tones
inline void toneOK() {
  //Serial.println("toneOK");
  if (!soundEnable) return;
  tone(soundPin, OKFreq, 100);
}
inline void tonePROCESS() {
  //Serial.println("tonePROCESS");
  if (!soundEnable) return;
  tone(soundPin, PROCESSFreq, 100);
}
inline void toneERROR() {
  //Serial.println("toneERROR");
  if (!soundEnable) return;
  tone(soundPin, ERRORFreq, 100);
}
inline void toneDEBUG() {
  //Serial.println("toneDEBUG");
  if (!soundEnable) return;
  tone(soundPin, PROCESSFreq, 100);
  delay(100);
  tone(soundPin, PROCESSFreq, 100);
  delay(100);
  tone(soundPin, OKFreq, 100);
}
void setDisplay(LiquidCrystal_I2C lcd, ProgState state) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(microCodeSetTree[state][4]);
  lcd.setCursor(0, 1);
  for (size_t i = 5; i < 9; i++) {
    lcd.print(microCodeSetTree[state][i]);
    lcd.print(" ");
  }
}
void IOSend(char* msg) {
  Serial.print(microSend);
  Serial.print(msg);
  Serial.println(microEnd);
}
void parseMicro(const char* code, const char* args) {
  //Serial.println(code);
  //Serial.println(args);
  /*
  if (strcmp(code, "EXEC___") == 0 && strcmp(args, "SOUND_TOGGLE") == 0) {
    soundEnable = !soundEnable;
    toneOK();
    return;
  }*/
  switch (microCodeStrToEnum(code)) {
    case GO_TO__:
      programState = progStateStrToEnum(args);
      setDisplay(lcd, programState);
      toneOK();
      break;
    case EXEC___:
      //Serial.println(subCodeStrToEnum(args));
      switch (subCodeStrToEnum(args)) {
        case APL:
          for (int i = 1000; i > 0; i--) {
            tone(soundPin, 440);
            delayMicroseconds(277);
            tone(soundPin, 2240);
          }
          noTone(soundPin);
          break;
        case GET_GPS:
          lcd.clear();
          if (!GPSInit) {
            lcd.setCursor(0, 0);
            lcd.print("GPS Not Init");
            toneERROR();
            delay(3000);
            setDisplay(lcd, programState);
            break;
          }
          lcd.setCursor(0, 0);
          lcd.print("[__________]");
          lcd.setCursor(0, 1);
          lcd.print("In Progress");
          long updateDiff = 0;
          double avgLat = 0;
          double avgLon = 0;
          long avgLatLong;
          long avgLonLong;
          while (updateDiff <= gpsAvg - 1) {
            if (Serial1.available()) {
              gpsParser.encode(Serial1.read());
            }

            if (gpsParser.location.isUpdated()) {
              lcd.clear();
              lcd.setCursor(0, 0);
              lcd.print("[");
              for (int i = 0; i < ((int)(((float)updateDiff / gpsAvg) * 10)) + 1; i++) {
                lcd.print("#");
              }
              for (int j = 0; j < 10 - ((int)(((float)updateDiff / gpsAvg) * 10)) - 1; j++) {
                lcd.print("_");
              }
              lcd.print("]");
              lcd.setCursor(0, 1);
              lcd.print("In Progress");
              GPSLat = gpsParser.location.lat();
              GPSLon = gpsParser.location.lng();
              updateDiff++;
              avgLat += GPSLat;
              avgLon += GPSLon;
              tonePROCESS();
            }
          }
          avgLat /= gpsAvg;
          avgLon /= gpsAvg;
          Serial.print(microSend);
          Serial.print(gpsInf);
          Serial.print(avgLat, 12);
          Serial.print(',')
          Serial.print(avgLon, 12);
          Serial.println(microEnd);
          setDisplay(lcd, programState);
          toneOK();
          break;
        case DUMP_GPS:
          break;
        case SOUND_TOGGLE:
          Serial.println("Sound Toggled");
          if (soundEnable) {
            soundEnable = false;
          } else {
            soundEnable = true;
          }
          toneOK();
          break;
        case UNKNOWNSUBCODE:
          toneERROR();
          break;
      }
      break;
    case IO_SEND:
      IOSend(args);
      toneOK();
      break;
    case NOTHING:
      break;
    case UNKNOWNCODE:
      Serial.println("Invalid MicroCode");
      Serial.print("MircoCode: ");
      Serial.print(code);
      Serial.print(" ");
      Serial.println(args);
      toneERROR();
  }
}
void parseBtn(int btnPin) {
  const char* microCode = microCodeSetTree[programState][btnPin - 4];
  size_t charIdx = 0;
  size_t sectionStart = 0;
  size_t sectionStartPrev = 0;
  char microFunction[8] = { 0 };
  char microArgs[30] = { 0 };

  while (microCode[charIdx] != microCodeEOC) {
    if (microCode[charIdx] == microCodeSEP) {
      sectionStartPrev = sectionStart;
      sectionStart = charIdx + 1;
      memset(microFunction, 0, sizeof(microFunction));
      strncpy(microFunction, microCode + (sectionStartPrev), 7);
      microFunction[7] = '\0';

      memset(microArgs, 0, sizeof(microArgs));
      if (strcmp(microFunction, "NOTHING") != 0) {
        strncpy(microArgs, microCode + (sectionStartPrev) + 8, charIdx - ((sectionStartPrev) + 8));
        microArgs[charIdx - ((sectionStartPrev) + 8)] = '\0';
      } else {
        strcpy(microArgs, "NONE");
      }
      parseMicro(microFunction, microArgs);
    }
    charIdx++;
  }
  memset(microFunction, 0, sizeof(microFunction));
  strncpy(microFunction, microCode + sectionStart, 7);
  microFunction[7] = '\0';

  memset(microArgs, 0, sizeof(microArgs));
  if (strcmp(microFunction, "NOTHING") != 0) {
    strncpy(microArgs, microCode + (sectionStart + 8), charIdx - (sectionStart + 8));
    microArgs[charIdx - (sectionStart + 8)] = '\0';
  } else {
    strcpy(microArgs, "NONE");
  }
  parseMicro(microFunction, microArgs);
}

void setup() {
  //Begin Serial Communication
  Serial.begin(19200);
  Serial1.begin(9600);

  //Initialize Lcd
  lcd.init();
  lcd.backlight();
  setDisplay(lcd, programState);

  //Set Pin Mode
  pinMode(blueTopPin, INPUT);
  pinMode(blueBottomPin, INPUT);
  pinMode(redTopPin, INPUT);
  pinMode(redBottomPin, INPUT);

  //Startup Tone
  tonePROCESS();
  delay(100);
  tonePROCESS();
  delay(100);
  toneOK();
  delay(100);
}


void loop() {
  if (Serial1.available()) {
    //toneOK();
    //Serial.print(Serial1.peek());
    GPSOn = true;
    if (GPSOn && beepLockNd) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("GPS On");
        lcd.setCursor(0, 1);
        lcd.print("Blue Top To Cont");
        while (!digitalRead(blueTopPin)) {
            tonePROCESS();
            delay(100);
            tonePROCESS();
            delay(100);
            toneOK();
            delay(100);
            toneOK();
            delay(1000);
        }
        setDisplay(lcd, programState);
      beepLockNd = false;
    }
    gpsParser.encode(Serial1.read());
  }

  if (Serial.available()) {
      serialBuf = Serial.read();
      if (((uint8_t)serialBuf >> 7) == 1) {
        toneOK();
        delay(100);
        toneOK();
      }
  }

  if (gpsParser.location.isUpdated() || false) {
    GPSInit = true;
    GPSLat = gpsParser.location.lat();
    GPSLon = gpsParser.location.lng();
    if (GPSInit && beepLock) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("GPS Init");
        lcd.setCursor(0, 1);
        lcd.print("Blue Top To Cont");
        while (!digitalRead(blueTopPin)) {
            tonePROCESS();
            delay(100);
            toneOK();
            delay(100);
            tonePROCESS();
            delay(100);
            toneOK();
            delay(1000);
        }
        setDisplay(lcd, programState);
      beepLock = false;
    }
  }
  debounceBtn(blueTopPin, parseBtn);
  debounceBtn(blueBottomPin, parseBtn);
  debounceBtn(redTopPin, parseBtn);
  debounceBtn(redBottomPin, parseBtn);
}
