import serial
import tkinter as tk
import sys
import threading
import time
import platform
from applicationTK import Application, ExtendedCanvas


def onClose():
    global running
    running = False
    window.destroy()
    sys.exit()


def serialInterface():
    global serialBuffer
    global serialMonitorText
    try:
        serialPort = serial.Serial(port, baudRate)
        while running:
            serBuf = serialPort.readline()
            if serBuf:
                serialPort.write(bytes([0b10000011]))
                serialMonitorText.config(state=tk.NORMAL)
                serialBuffer = serialBuffer + str(serBuf)[2:-1]
                serialMonitorText.insert('insert', str(serBuf)[2:-1])
                serialMonitorText.config(state=tk.DISABLED)
                print(serBuf)
            time.sleep(1)
    except serial.SerialException as e:
        print(f"Error: {e}")


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'


baudRate = 19200
serialBuffer = ""

r = Application(name="Test", size="1280x640")
r.addElement("Test Label", tk.Label, r.root, text="test")
r.addElement("Test Canvas", ExtendedCanvas, r.root, width=65535, height=65535,
             bg='white')
r.modifyReference("Test Canvas", r.getElement("Test Canvas").getCanvas())
r.placeElement("Test Canvas", x=0, y=0, relwidth=0.9, relheight=0.9)
r.placeElement("Test Label", x=0, y=0, relwidth=0.5, relheight=0.5)
r.run()

window = tk.Tk()
window.title("Mappy Host Module")
window.protocol("WM_DELETE_WINDOW", onClose)
window.geometry("1280x640")

mapFrame = tk.LabelFrame(window, text="Map")
mapFrame.place(x=0, y=0, relwidth=0.8, relheight=0.7)

serialMonitorFrame = tk.LabelFrame(window, text="Serial Monitor")
serialMonitorFrame.place(x=0, rely=0.7, relwidth=0.8, relheight=0.3)

polygonMonitorFrame = tk.LabelFrame(window, text="Polygon Monitor")
polygonMonitorFrame.place(relx=0.8, y=0, relwidth=0.2, relheight=1)

serialMonitorText = tk.Text(
        serialMonitorFrame,
        font=("Segoe UI", 14),
        wrap=tk.CHAR,
        state=tk.DISABLED,
        )
serialMonitorText.place(relx=0.05, rely=0.05, relwidth=0.9, relheight=0.9)
serialMonitorTextScrollbar = tk.Scrollbar(
        serialMonitorFrame,
        command=serialMonitorText.yview
        )
serialMonitorText.config(yscrollcommand=serialMonitorTextScrollbar.set)
serialMonitorTextScrollbar.pack(side=tk.RIGHT, fill=tk.Y)

mapCanvas = tk.Canvas(
        mapFrame,
        confine=False,
        bg='white',
        width=65535,
        height=65535,
        )
mapCanvas.pack(expand=True, fill=tk.BOTH)

mapCanvas.create_line(0, 0, 240, 240, fill='red')

running = True
serialThread = threading.Thread(target=serialInterface, daemon=True)
serialThread.start()

window.mainloop()
