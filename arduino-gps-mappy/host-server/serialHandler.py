import serial
import time


# micro host Comms
class commsHeader:
    microSend = 0b11110001
    microEnd = 0b11110010

    gps_Info = 0b11000001
    gps_NA = 0b11000010

    noHeader = 0b0


class SerialHandler:
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
        if time.time() - self.serialInputTime > 4.9:
            print("message timed out, discarding")
            self.serialBuffer = []
            return (commsHeader.noHeader, [])
        while self.serialPort.inWaiting:
            readingByte = self.serialPort.read()
            self.serialBuf.append(readingByte)
            if readingByte == commsHeader.microSend:
                self.haveSendHeader = True
                self.serialInputTime = time.time()
                self.serialBuffer = []
            if readingByte == commsHeader.microEnd:
                self.haveEndHeader = True
                break

        if len(self.serialBuf) > 0 and self.haveSendHeader and self.haveEndHeader:
            byteBuf = self.serialBuffer.copy()
            msgType = byteBuf.pop(1)
            byteBuf.pop(0)
            byteBuf.pop()
            self.haveSendHeader = False
            self.haveEndHeader = False
            self.serialBuffer = []
            return (msgType, byteBuf)
        return (commsHeader.noHeader, [])
