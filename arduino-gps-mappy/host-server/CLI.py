import applicationTK
import SerialHandler
import PolygonHandler
import time
import threading


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
        self.running = False
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
        self.running = True

        match cmdType:
            case "new":
                self.polyHandler.new()
                self.pushOutput("created new polygon")
                self.running = False
            case "cancel":
                self.polyHandler.cancel()
                self.pushOutput("cancelled current polygon")
                self.running = False
            case "close":
                verticesCnt = len(self.polyHandler.polygonData)
                self.polyHandler.closePolygon()
                polyVertices = self.pushOutput(
                    f'closed a polygon with {verticesCnt} vertices'
                )
                self.polyData

                self.running = False
            case "scan":
                if self.polyHandler.isFree:
                    self.pushOutput("no polygon to add vertex to")
                    self.running = False
                    return
                self.pushOutput("started GPS scan job, starting in 5")

                def scanJob():
                    for i in range(4):
                        time.sleep(1)
                        self.pushOutput(f'{4-i}')
                    gps = self.polyHandler.gpsHandler
                    scanTotal = 10
                    scanCount = 0
                    gpsAvg = (0, 0)
                    gpsUpt = gps.upt
                    while scanCount <= scanTotal:
                        gps.readPacket(
                            self.serialHandler.read()
                        )
                        if gps.isValid and gps.upt - gpsUpt >= 1:
                            scanCount += 1
                            gpsAvg[0] += gps.lat
                            gpsAvg[1] += gps.lng
                            gpsUpt = gps.upt
                    gpsAvg[0] /= scanCount
                    gpsAvg[1] /= scanCount
                    self.polyHandler.addVertex(gpsAvg[0], gpsAvg[1])
                    self.running = False
                threading.Thread(target=scanJob, daemon=True).start()
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
