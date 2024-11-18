import serial
import time
import os


# micro host Comms
class commsHeader:
    microSend = 0b11110001
    microEnd = 0b11110010

    gpsInfo = 0b11000001
    gpsNA = 0b11000010
    gpsStart = 0b11000011

    noHeader = 0b0


class SerialHandler:
    noneHeader = (0, [])

    def __new__(cls, port, *argv, **kwarg):
        if not os.path.exists(port):
            print(f'Port {port} isnt connected')
            return None
        return super().__new__(cls)

    def __init__(self, baudRate, port):
        self.serialPort: serial.Serial = serial.Serial(port, baudRate)
        self.baud = baudRate
        self.port = port

        self.serialBuffer = []
        self.serialInputTime = -1
        self.haveSendHeader = False
        self.haveEndHeader = False

    def write(self, buf):
        self.serialPort.write(commsHeader.hostSend)
        self.serialPort.write(buf)
        self.serialPort.write(commsHeader.hostEnd)

    def read(self):
        msgType = commsHeader.noHeader
        while self.serialPort.in_waiting > 0:
            if time.time() - self.serialInputTime > 4.9 and self.haveSendHeader:
                print("message timed out, dropping packet")
                self.serialBuffer = []
                return (commsHeader.noHeader, [])
            readingByte = self.serialPort.read()
            # print('reading: ', readingByte)
            self.serialBuffer.append(readingByte)
            if readingByte == bytes([commsHeader.microSend]):
                self.haveSendHeader = True
                self.serialInputTime = time.time()
                self.serialBuffer = [readingByte]
            if readingByte == bytes([commsHeader.microEnd]):
                self.haveEndHeader = True
                break

        if len(self.serialBuffer) > 0 and self.haveSendHeader and self.haveEndHeader:
            byteBuf = self.serialBuffer.copy()
            msgType = byteBuf.pop(1)
            byteBuf.pop(0)
            byteBuf.pop()
            self.haveSendHeader = False
            self.haveEndHeader = False
            self.serialBuffer = []
            print(f"reading: {(msgType, byteBuf)}")
            return (msgType, byteBuf)
        return (commsHeader.noHeader, [])

    def waitUntilHeader(self, header):
        incommingPacket = self.noneHeader
        headerByte = bytes([header])
        while incommingPacket[0] != headerByte:
            incommingPacket = self.read()
