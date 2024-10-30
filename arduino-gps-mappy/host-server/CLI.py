import applicationTK
import SerialHandler
import PolygonHandler


cmd_registry = {}


class CLICMD:
    export = "export"
    test = "test"
    clear = "clear"
    polygon = "polygon"


def command(name):
    def decorator(fn):
        cmd_registry[name] = fn


@command(CLICMD.polygon)
def polygonCLI():
    print()


@command(CLICMD.test)
def polygonTestGeneration():
    print()


class CLI:
    def __init__(
        self,
        polygonData: applicationTK.ExtendedTreeview,
        serialHandler: SerialHandler.SerialHandler,
        polygonHandler: PolygonHandler.PolygonHandler
    ):
        self.polyHandler = polygonHandler
        self.serialHandler = serialHandler
        self.polyData = polygonData

    def runCmd(self, cmd):
        if cmd == CLICMD.clear:
            print("CLI command 'clear' should be handled by the CLI GUI not the CLI itself")
            return
        print(cmd)
