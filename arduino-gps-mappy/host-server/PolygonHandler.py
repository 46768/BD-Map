import applicationTK
import GPSHandler


class PolygonHandler:
    def __init__(
            self,
            TreeviewHandler: applicationTK.ExtendedTreeview
    ):
        self.treeview = TreeviewHandler
        self.gpsHandler = GPSHandler.GPSHandler()
        self.polygonData = []
        self.isFree = True

    def new(self):
        self.polygonData = []
        self.isFree = False

    def cancel(self):
        self.isFree = True

    def closePolygon(self):
        self.isFree = True
        return self.polygonData

    def addVertexFromPacket(self, packet):
        gps = self.gpsHandler
        gps.readPacket(packet)
        if (not gps.isValid):
            print("GPS packet not valid, vertices unchanged")
            return

        self.polygonData.append((gps.lat, gps.lng))
