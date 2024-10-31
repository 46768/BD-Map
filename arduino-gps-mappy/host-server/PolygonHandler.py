import GPSHandler


class PolygonHandler:
    def __init__(
            self,
    ):
        self.gpsHandler = GPSHandler.GPSHandler()
        self.polygonData = []
        self.polygonName = ""
        self.isFree = True

    def new(self, name):
        self.polygonData = []
        self.polygonName = name
        self.isFree = False

    def cancel(self):
        self.isFree = True
        self.polygonName = ""

    def closePolygon(self):
        self.isFree = True
        self.polygonName = ""
        return (self.polygonName, self.polygonData)

    def addVertexFromPacket(self, packet):
        gps = self.gpsHandler
        gps.readPacket(packet)
        if (not gps.isValid):
            print("GPS packet not valid, vertices unchanged")
            return

        self.polygonData.append((gps.lat, gps.lng))

    def addVertex(self, x, y):
        self.polygonData.append((x, y))
