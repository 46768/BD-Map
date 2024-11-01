import serial
import platform
import threading
from SerialHandler import SerialHandler
from PolygonHandler import PolygonHandler
from interface import makeApp


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'

baudRate = 19200
serialPort
polygonHandler


def serialInterface():
    global port
    global baudRate
    global serialPort
    global polygonHandler
    try:
        serialPort = SerialHandler(baudRate=baudRate, port=port)
        polygonHandler = PolygonHandler()
    except serial.SerialException as e:
        print(f"Error: {e}")
        return


running = True
serialThread = threading.Thread(target=serialInterface, daemon=True)
serialThread.start()
app = makeApp(serialPort, polygonHandler)
app.run()
