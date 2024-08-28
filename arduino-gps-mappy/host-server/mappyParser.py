import serial
import struct


# micro host Comms
class commsHeader:
    microSend = 0b11110001
    microEnd = 0b11110010
    microReceived = 0b11110011
    microError = 0b11110100

    hostSend = 0b10000001
    hostEnd = 0b10000010
    hostReceived = 0b10000011
    hostError = 0b10000100

    gpsInf = 0b11000010
    gpsNew = 0b11000001
    gpsEnd = 0b11000011
    gpsCnl = 0b11000100

    ioCnct = 0b11100001
    ioMsg = 0b11100010

    logSend = 0b11010001
    logRqst = 0b11010010
    logRecv = 0b11010011


class Parser:
    def __init__(self, serialHandler: serial.Serial):
        self.serBuffer = 0
        self.dataBuffer = []
        self.parsing = False
        self.microParsing = False
        self.microHeader = 0b00000000
        self.persistentData = []
        self.serialHandler = serialHandler

    def appendBuffer(self, data):
        self.serBuffer = data
        self.dataBuffer.append(data)

    def getBuffer(self):
        return self.dataBuffer

    def parse(self):
        if self.parsing:
            return
        self.parsing = True
        # Get Header and Start Signal
        byte = self.serBuffer
        # print("parser byte:")
        # print(byte)
        # print("microEnd:")
        # print(commsHeader.microEnd)
        if self.microParsing and self.microHeader == 0:
            self.microHeader = byte
        if byte == commsHeader.microSend and not self.microParsing:
            self.microParsing = True
        if byte == commsHeader.microEnd:
            hostHeader = commsHeader.hostReceived
            # Data sanitization
            data = self.dataBuffer[2:-1]
            # print("dataBuffer:")
            # print(self.dataBuffer)
            # print("data:")
            # print(data)
            match self.microHeader:
                case commsHeader.gpsNew:
                    print("Gps New")
                    self.persistentData = []
                case commsHeader.gpsInf:
                    print("gps INF")
                    gpsLatByte = 0
                    gpsLonByte = 0
                    # print("gps INF parsing data:")
                    # print(data)
                    for (idx, byte) in enumerate(data):
                        # print("loop byte")
                        # print(byte)
                        # print(idx)
                        if idx < 4:
                            gpsLatByte += byte * ((idx % 4)+1)
                        else:
                            gpsLonByte += byte * ((idx % 4)+1)

                    gpsLatByte = gpsLatByte.to_bytes(4, byteorder="big")
                    gpsLonByte = gpsLonByte.to_bytes(4, byteorder="big")
                    # print(gpsLatByte)
                    # print(gpsLonByte)
                    self.persistentData.append((
                        struct.unpack(">f", gpsLatByte)[0],
                        struct.unpack(">f", gpsLonByte)[0],
                    ))
                case commsHeader.gpsCnl:
                    print("gpscnl")
                    self.persistentData = []
                case commsHeader.gpsEnd:
                    print("gpsEnd")
                case commsHeader.ioCnct:
                    print("ioCnct")
                    self.serialHandler.write(commsHeader.hostSend)
                    self.serialHandler.write(data)
                    self.serialHandler.write(commsHeader.hostEnd)
                case commsHeader.ioMsg:
                    print("ioMsg")

                case _:
                    print("Unknown Header")
                    hostHeader = commsHeader.hostError
            self.dataBuffer = []
            self.microParsing = False
            self.microHeader = 0b00000000
            self.serialHandler.write(commsHeader.hostSend)
            self.serialHandler.write(hostHeader)
            self.serialHandler.write(commsHeader.hostEnd)

        self.serBuffer = 0
        self.parsing = False
