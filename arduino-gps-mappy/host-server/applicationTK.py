import tkinter as tk
import sys


class ExtendedText:
    def __init__(self, master, **kwargs):
        self.textRef = tk.Text(master, kwargs, state=tk.DISABLED)
        self.text = ""

    def setText(self, string):
        self.text = string
        self.textRef.config(state=tk.NORMAL)
        

    def getDef(self):
        return self.textRef

    

class ExtendedCanvas:
    def __init__(self, master, **kwargs):
        self.canvas = tk.Canvas(master, kwargs)

    def getCanvas(self):
        return self.canvas


class Application:
    def __init__(self, name, size):
        self.root = tk.Tk()
        self.root.title(name)
        self.root.geometry(size)
        self.root.protocol("WM_DELETE_WINDOW", self.exit)
        self.element = {"root": self.root}

    def run(self):
        self.root.mainloop()

    def exit(self):
        self.root.destroy()
        sys.exit()

    def addElement(self, name, tkWidget, master, **kwargs):
        self.element[name] = tkWidget(master, **kwargs)

    def placeElement(self, name, **kwargs):
        self.element[name].place(kwargs)

    def configElement(self, name, **kwargs):
        if self.element[name]:
            self.element[name].config(kwargs)

    def getElement(self, name):
        return self.element[name]

    def modifyReference(self, name, newRef):
        if self.element[name]:
            self.element[name] = newRef
