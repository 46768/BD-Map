# micro host Comms
microSend = 0b00000001
microEnd = 0b00000010
microReceived = 0b00000011
microError = 0b00000100

hostSend = 0b10000001
hostEnd = 0b10000010
hostReceived = 0b10000011
hostError = 0b10000100

gpsNew = 0b11000010
gpsInf = 0b11000001

ioCnct = 0b11100001
ioMsg = 0b11100010

logSend = 0b11010001
logRqst = 0b11010010
logRecv = 0b11010011


class Parser:
    def __init__(self, serialHandler):
        self.serBuffer = []
        self.parsing = False
        self.microParsing = False
        self.microHeader = 0b00000000
        self.persistentData = 0
        self.serialHandler = serialHandler

    def appendBuffer(self, data):
        self.serBuffer.append(data)

    def getBuffer(self):
        return self.serBuffer

    def parse(self):
        if self.parsing:
            return
        self.parsing = True
        for byte in self.serBuffer:
            if self.microHeader == 0 and self.microParsing:
                print("parsing and empty header")
                self.microHeader = byte
            if byte == microSend:
                if self.microParsing:
                    print("miParsing")
                else:
                    self.microParsing = True
            if byte == microEnd:
                self.microParsing = False
                self.microHeader = 0b00000000
            print(byte)
            print(self.microParsing)
            print(self.microHeader)
        self.serBuffer = []
        self.parsing = False
