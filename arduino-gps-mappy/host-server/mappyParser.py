import applicationTK
import uuid
import SerialHandler
import GPSHandler


class Parser:
    def __init__(
            self,
            serialHandler: SerialHandler.SerialHandler,
            TreeviewHandler: applicationTK.ExtendedTreeview
    ):
        self.serialHandler = serialHandler
        self.treeview = TreeviewHandler
        self.gpsHandler = GPSHandler.GPSHandler()

    def parse(self):
        self.gpsHandler.readPacket(self.serialHandler.read())
