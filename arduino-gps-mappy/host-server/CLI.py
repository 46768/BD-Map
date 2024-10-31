import applicationTK
import SerialHandler
import PolygonHandler
import time


class CLICMD:
    export = "export"
    clear = "clear"
    polygon = "polygon"


class CLI:
    def __init__(
        self,
        polygonData: applicationTK.ExtendedTreeview,
        serialHandler: SerialHandler.SerialHandler,
        polygonHandler: PolygonHandler.PolygonHandler,
        outputUpdater
    ):
        self.polyHandler = polygonHandler
        self.serialHandler = serialHandler
        self.polyData = polygonData
        self.updateOutput = outputUpdater
        self.cmdRegistry = {}
        self.outputBuffer = []

    def pushOutput(self, lineText):
        self.outputBuffer.append(lineText)
        self.updateOutput()

    def command(self, name):
        def decorator(fn):
            self.cmdRegistry[name] = fn

    @command(CLICMD.polygon)
    def polygonCLI(self, *args):
        print()
        cmdType = args[0]

        match cmdType:
            case "new":
                self.polyHandler.new()
                self.pushOutput("created new polygon")
            case "cancel":
                self.polyHandler.cancel()
                self.pushOutput("cancelled current polygon")
            case "close":
                verticesCnt = len(self.polyHandler.polygonData)
                self.polyHandler.closePolygon()
                self.pushOutput(f'closed a polygon with {verticesCnt} vertices')
            case "scan":
                self.pushOutput("started GPS scan job, starting in 5")
                for i in range(4):
                    time.sleep(1)
                    self.pushOutput(f'{4-i}')
                scanCount = 0
                while scanCount <= 10:
                    print()
            case "test":
                print()
            case _:
                print()

    def runCmd(self, cmd, *args):
        if cmd == CLICMD.clear:
            self.outputBuffer.clear()
            return
        commandFn = self.cmdRegistry.get(cmd)
        if (commandFn is None):
            print("unknown command")
            return
        return commandFn(self, *args)
