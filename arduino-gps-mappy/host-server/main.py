import serial
import platform
import threading
from SerialHandler import SerialHandler
from PolygonHandler import PolygonHandler
from interface import makeApp


def serialInterface(serialHandler):
    try:
        print()
    except serial.SerialException as e:
        print(f"Error: {e}")
        return


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'

baudRate = 19200
serialPort = SerialHandler(baudRate=baudRate, port=port)
polygonHandler = PolygonHandler()

app = makeApp(serialPort, polygonHandler)

running = True
serialThread = threading.Thread(target=serialInterface, daemon=True)
serialThread.start()
app.run()
