import serial
import tkinter as tk

port = 'COM3'  # '/dev/ttyUSB0' on linux
baud_rate = 19200

try:
    serialPort = serial.Serial(port, baud_rate)
    while True:
        serBuf = serialPort.read_all()
        if serBuf:
            print(serBuf)
except serial.SerialException as e:
    print(f"Error: {e}")
finally:
    if serialPort.is_open:
        serialPort.close()
