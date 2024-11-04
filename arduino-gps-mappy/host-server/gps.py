import struct
from SerialHandler import commsHeader


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
        if packet[0] != commsHeader.gps_Info:
            print("GPS Handler: readPacket: invalid packet type")
            self.isValid = False
            return
        if len(packet[1]) != 6:
            print("GPS Handler: readPacket: invalid packet data size")
            self.isValid = False
            return

        latitudeBytes = bytes(packet[1][0:2])
        longitudeBytes = bytes(packet[1][2:4])
        updateBytes = bytes(packet[1][4:])

        self.lat = float(struct.unpack("<f", latitudeBytes)[0])
        self.lng = float(struct.unpack("<f", longitudeBytes)[0])
        self.upt = int(struct.unpack("<I", updateBytes)[0])
        self.isValid = True
