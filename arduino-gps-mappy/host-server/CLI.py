import applicationTK
import SerialHandler


class CLICMD:
    export = "export"
    test = "test"
    clear = "clear"
    polygon = "polygon"


class CLI:
    def __init__(
        self,
        polygonData: applicationTK.ExtendedTreeview,
        serialHandler: SerialHandler.SerialHandler
    ):
        print("hekki")
