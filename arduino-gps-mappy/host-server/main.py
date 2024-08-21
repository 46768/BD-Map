import serial
import tkinter as tk
import os
import threading
import time
import platform
import mappyParser


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

while True:
    time.sleep(1)
