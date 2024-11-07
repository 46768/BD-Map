import struct
from serialHandler import commsHeader


def joinByteArray(byteArray):
    returnByte = byteArray[0]
    for i in range(1, len(byteArray)):
        returnByte += byteArray[i]
    return returnByte


class GPSHandler:
    def __init__(self):
        self.lat = 0
        self.lng = 0
        self.upt = 0
        self.isValid = False

    def readPacket(self, packet):
        if len(packet) != 2:
            print("GPS Handler: readPacket: invalid packet size")
            self.isValid = False
            return
        if packet[0] == commsHeader.noHeader:
            self.isValid = False
            return
        if packet[0] != bytes([commsHeader.gpsInfo]):
            print("GPS Handler: readPacket: invalid packet type")
            self.isValid = False
            return
        if len(packet[1]) != 10:
            print("GPS Handler: readPacket: invalid packet data size")
            self.isValid = False
            return

        latitudeBytes = joinByteArray(packet[1][0:4])
        longitudeBytes = joinByteArray(packet[1][4:8])
        updateBytes = joinByteArray(packet[1][8:]) + bytes([0, 0])

        self.lat = float(struct.unpack("<f", latitudeBytes)[0])
        self.lng = float(struct.unpack("<f", longitudeBytes)[0])
        self.upt = int(struct.unpack("<I", updateBytes)[0])
        self.isValid = True
