import serial


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
        
        print()
