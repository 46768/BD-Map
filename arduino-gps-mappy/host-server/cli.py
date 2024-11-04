import applicationTK
import SerialHandler
import PolygonHandler
import time
import threading
import uuid
import random
import os


class CLICMD:
    export = "export"
    clear = "clear"
    polygon = "polygon"


class CLI:
    def __init__(
        self,
        polygonData,
        serialHandler,
        polygonHandler,
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
        self.updateOutput(self.outputBuffer)

    def command(name):
        def decorator(fn):
            def wrapper(self, *args, **kwargs):
                self.cmdRegistry[name] = fn
            return wrapper
        return decorator

    @command(CLICMD.export)
    def exporter(self, *args):
        self.running = True
        polygonData = self.polygonHandler.data
        if not os.path.exists("export/"):
            os.mkdir("export/")
        with open("export/export.csv", "w", newline='\n') as file:
            for label in polygonData:
                if label == "temp" and len(polygonData[label]) != 4:
                    continue
                data = [label] + polygonData[label]
                self.pushOutput(f'exporting {label}')
                file.write(",".join(data))
                file.write('\n')
            file.close()
        self.pushOutput("exported")
        self.running = False

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
                polyVertices = self.polyHandler.closePolygon()
                self.pushOutput(
                    f'closed a polygon with {verticesCnt} vertices'
                )
                self.polyData.setData(
                    polyVertices[0],
                    [f'{vert[0]},{vert[1]}' for vert in polyVertices[1]]
                )

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
                for i in range(20):
                    dataKey = str(uuid.uuid4())
                    offX = random.randint(0, 2000)
                    offY = random.randint(0, 2000)
                    self.polyHandler.addData(
                        dataKey,
                        f"{100+random.randint(0, 200)+offX},{100+random.randint(0, 200)+offY}"
                    )
                    self.polyHandler.addData(
                        dataKey,
                        f"{100+random.randint(0, 200)+offX},{300+random.randint(0, 200)+offY}"
                    )
                    self.polyHandler.addData(
                        dataKey,
                        f"{300+random.randint(0, 200)+offX},{300+random.randint(0, 200)+offY}"
                    )
                    self.polyHandler.addData(
                        dataKey,
                        f"{300+random.randint(0, 200)+offX},{100+random.randint(0, 200)+offY}"
                    )
            case _:
                self.pushOutput("unknown command")

    def runCmd(self, cmd, *args):
        if cmd == CLICMD.clear:
            self.outputBuffer.clear()
            self.updateOutput(self.outputBuffer)
            return
        commandFn = self.cmdRegistry.get(cmd)
        if (commandFn is None):
            print("unknown command")
            return
        return commandFn(self, *args)
