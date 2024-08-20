# micro host Comms
microSend = 0b00000001
microEnd = 0b00000010
microReceived = 0b00000011
microError = 0b00000100

hostSend = 0b10000001
hostEnd = 0b10000010
hostReceived = 0b10000011
hostError = 0b10000100

gpsInf = 0b11000001

ioCnct = 0b11100001


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
        for (idx, char) in enumerate(self.serBuffer):
            if char == microSend:
                self.microParsing = True
                self.microHeader = self.serBuffer[idx+1]
            if char == microEnd:
                self.microParsing = False
                self.microHeader = 0b00000000
            print(char)
            print(self.microParsing)
            print(self.microHeader)
        self.serBuffer = []
        self.parsing = False
