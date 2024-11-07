//Import Libraries
#include "TinyGPSPlus.h"
#include <string.h>

//Host-Micro Protocol
#define micro_send (char)0b11110001
#define micro_end (char)0b11110010

#define gps_info (char)0b11000001
#define gps_na (char)0b11000010
#define gps_start (char)0b11000011

#define double_s sizeof(double)
#define uint_s sizeof(unsigned int)

// TinyGpsPlus 
TinyGPSPlus gps;

// variables
double gps_lat;
double gps_lng;
unsigned int gps_upt = 0;
bool gps_uart = false;
bool prev_gps_uart = false;

char uart_buf[(2*double_s)+uint_s];

// helper functions

// size in bytes
void send_UART(char type, char* buf = nullptr, size_t buf_size = 0) {
	Serial.write(micro_send);
	Serial.write(type);
	if (buf != nullptr) {
		Serial.write(buf, buf_size);
	}
	Serial.write(micro_end);
}

void setup() {
	// UART communication between host and arduino
	Serial.begin(19200);
	// GPS serial input
	Serial1.begin(9600);
	send_UART(gps_start);
	pinMode(13, OUTPUT);
}

void loop() {
	// retrieve gps if available
	bool have_gps = false;
	gps_uart = false;
	digitalWrite(13, LOW);
	while (Serial1.available() > 0) {
		gps.encode(Serial1.read());
		digitalWrite(13, HIGH);
		have_gps = true;
		gps_uart = true;
	}
	if (gps.location.isUpdated()) {
		gps_lat = gps.location.lat();
		gps_lng = gps.location.lng();
		gps_upt++;
	}

	memcpy(uart_buf, &gps_lat, double_s);
	memcpy(uart_buf+double_s, &gps_lng, double_s);
	memcpy(uart_buf+(2*double_s), &gps_upt, uint_s);

	if (have_gps) {
		if (gps.location.isValid()) {
			send_UART(gps_info, uart_buf, sizeof(uart_buf));
		} else if (prev_gps_uart != gps_uart && gps_uart == false) {
			send_UART(gps_na);
		}
	}
	prev_gps_uart = gps_uart;
}
