import serial


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

    def write(self, buf):
        self.serialPort.write(commsHeader.hostSend)
        self.serialPort.write(buf)
        self.serialPort.write(commsHeader.hostEnd)

    def read(self):
        byteBuf = []
        msgType = commsHeader.noHeader
        haveSendHeader = False
        haveEndHeader = False
        while self.serialPort.inWaiting:
            readingByte = self.serialPort.read()
            byteBuf.append(readingByte)
            if readingByte == commsHeader.microSend:
                haveSendHeader = True
            if readingByte == commsHeader.microEnd:
                haveEndHeader = True
                break

        if not (haveSendHeader and haveEndHeader):
            return (commsHeader.noHeader, [])
        if len(byteBuf) > 0:
            msgType = byteBuf.pop(0)
            byteBuf.pop()

        return (msgType, byteBuf)
