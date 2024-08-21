import serial
import tkinter as tk
import platform
import mappyParser
from tkinter import ttk
import threading
import time
import platform
import uuid
import applicationTK


def serialInterface():
    global serialBuffer
    try:
        serialPort = serial.Serial(port, baudRate)
        gpsParser = mappyParser.Parser(serialPort)
        while running:
            serBuf = serialPort.read()
            if serBuf:
                gpsParser.appendBuffer(ord(serBuf))
                print(gpsParser.getBuffer())
                gpsParser.parse()
    except serial.SerialException as e:
        print(f"Error: {e}")
        return


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'


baudRate = 19200
serialBuffer = ""


running = True
serialThread = threading.Thread(target=serialInterface, daemon=True)
serialThread.start()


# Root Structure
app = Application("Mappy Host Module", "1280x640")
app.addElement("MapFrame", tk.LabelFrame, app.root, text="Map")
app.addElement("PolygonFrame", tk.LabelFrame, app.root, text="Polygon Monitor")
app.addElement("SerialFrame", tk.LabelFrame, app.root, text="Serial Monitor")

# Root Structure Placement
app.placeElement("MapFrame", x=0, y=0, relheight=0.7, relwidth=0.8)
app.placeElement("SerialFrame", x=0, rely=0.7, relheight=0.3, relwidth=0.8)
app.placeElement("PolygonFrame", relx=0.8, y=0, relheight=1, relwidth=0.2)

# Map Frame Structure
app.addElement("MapCanvas", ExtendedCanvas, app.element["MapFrame"],
               confine=False, bg="white")

# Map Frame Rereference
app.addReference("MapCanvasRef", app.element["MapCanvas"].getCanvas())

# Map Frame Placement
app.placeElement("MapCanvasRef", relx=0.005, rely=0.005,
                 relwidth=0.99, relheight=0.99)

# Serial Frame Structure
app.addElement("SerialText", ExtendedText, app.element["SerialFrame"])

# Serial Frame Rereference
app.addReference("SerialTextRef", app.element["SerialText"].getRef())

# Serial Frame Placement
app.placeElement("SerialTextRef", relx=0.025, rely=0.025,
                 relwidth=0.95, relheight=0.95)

# Polygon Frame Structure
app.addElement("PolygonTree", ttk.Treeview, app.element["PolygonFrame"])
app.addElement("PolyTreeScroll", tk.Scrollbar, app.element["PolygonFrame"],
               orient="vertical", command=app.element["PolygonTree"].yview)

# Polygon Frame Configing
app.configElement("PolygonTree", yscrollcommand=app.element["PolyTreeScroll"].
                  set)

# Polygon Frame Placement
app.placeElement("PolygonTree", relx=0.025, rely=0.025,
                 relwidth=0.95, relheight=0.95)
app.placeElement("PolyTreeScroll", relx=0.95, rely=0,
                 relheight=1, relwidth=0.0125)


# Testing
app.element["SerialText"].insertText("Hello World!")
app.element["PolygonTree"].insert('', '0', 'Poly1', text=str(uuid.uuid4()))
app.element["PolygonTree"].insert('Poly1', '1', 'Poly1atrb0', text="c1")
app.element["PolygonTree"].insert('Poly1', '2', 'Poly1atrb1', text="c2")
app.element["PolygonTree"].insert('Poly1', '3', 'Poly1atrb2', text="c3")
app.element["PolygonTree"].insert('Poly1', '4', 'Poly1atrb3', text="c4")

app.element["PolygonTree"].insert('', '5', 'Poly2', text=str(uuid.uuid4()))
app.element["PolygonTree"].insert('Poly2', '6', 'Poly2atrb0', text="c1")
app.element["PolygonTree"].insert('Poly2', '7', 'Poly2atrb1', text="c2")
app.element["PolygonTree"].insert('Poly2', '8', 'Poly2atrb2', text="c3")
app.element["PolygonTree"].insert('Poly2', '9', 'Poly2atrb3', text="c4")

app.element["SerialText"].insertText(" Hi yall")
app.element["SerialText"].setText("Omg lmao")
app.run()
