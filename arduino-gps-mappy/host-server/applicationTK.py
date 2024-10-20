import uuid
import tkinter as tk
from tkinter import scrolledtext
from tkinter import ttk
import random
import sys
import os
from typing import List, Dict


class ExtendedText:
    def __init__(self, master, **kwargs):
        self.textRef = scrolledtext.ScrolledText(
                master,
                state=tk.DISABLED, wrap=tk.CHAR)

        self.text = ""

    def insertText(self, string):
        self.textRef.config(state=tk.NORMAL)
        self.textRef.insert(tk.INSERT, string)
        self.textRef.see(tk.END)
        self.textRef.config(state=tk.DISABLED)
        self.text = self.text + string

    def setText(self, string):
        self.textRef.config(state=tk.NORMAL)
        self.textRef.insert(tk.INSERT, "Del")
        if self.text != "":
            self.textRef.insert(tk.INSERT, "Del")
            self.textRef.delete('1.0', tk.END)
        self.textRef.insert(tk.INSERT, string)
        self.textRef.see(tk.END)
        self.textRef.config(state=tk.DISABLED)
        self.text = string

    def getRef(self):
        return self.textRef


class ExtendedTreeview:
    def __init__(self, master, **kwargs):
        self.treeview = ttk.Treeview(master)
        self.scrollbar = tk.Scrollbar(master,
                                      orient="vertical",
                                      command=self.treeview.yview,
                                      )
        self.data: Dict[str, List[str]] = {"temp": []}
        self.namespaceUUID = uuid.uuid4()
        self.treeData = []

        self.treeview.config(yscrollcommand=self.scrollbar.set)

    def placeElement(self):
        self.treeview.place(
                relx=0.025, rely=0.025,
                relwidth=0.95, relheight=0.95
        )
        self.scrollbar.place(
                relx=0.95, rely=0,
                relwidth=0.0125, relheight=1
        )

    def refreshTree(self):
        self.treeview.delete(*self.treeview.get_children())
        self.treeData = []
        for k, v in self.data.items():
            keyUUID = uuid.uuid3(self.namespaceUUID, k)
            self.treeData.append([
                '',
                keyUUID,
                keyUUID
            ])
            for data in v:
                self.treeData.append([
                    keyUUID,
                    uuid.uuid3(keyUUID, data+str(uuid.uuid4())),
                    data
                ])

        for data in self.treeData:
            self.treeview.insert(
                    data[0],
                    tk.END,
                    data[1],
                    text=data[2]
                )

    def replicateFromTemp(self, label):
        print(f"temp replaced into {label}")
        self.data[str(label)] = self.data["temp"]
        self.refreshTree()

    def setData(self, label, data):
        self.data[label] = data
        self.refreshTree()

    def addData(self, label, data):
        if not (label in self.data):
            self.data[label] = []

        self.data[label].append(data)
        self.refreshTree()

    def clearTemp(self):
        self.data["temp"] = []
        self.refreshTree()

    def getTreeview(self):
        return self.treeview


class ExtendedCanvas:
    def __init__(self, master, **kwargs):
        self.canvas = tk.Canvas(master, kwargs)

    def getCanvas(self):
        return self.canvas


class commands:
    export = "export"
    clear = "clear"
    test = "test"


class CommandLine:
    def __init__(self, master, polygonHandler: ExtendedTreeview):
        self.commandFrame = tk.Frame(master)
        self.commandline = tk.Entry(self.commandFrame)
        self.commandTerminal = ExtendedText(self.commandFrame)
        self.commandline.bind("<Return>", self.runCommand)
        self.polygonHandler = polygonHandler

        self.commandTerminal.insertText("[host]: ")

    def runCommand(self, event):
        inpt = self.commandline.get()
        self.commandTerminal.insertText(f'{inpt}\n')

        match inpt:
            case commands.export:
                polygonData = self.polygonHandler.data
                if not os.path.exists("export/"):
                    os.mkdir("export/")
                with open("export/export.csv", "w", newline='\n') as file:
                    for label in polygonData:
                        if label == "temp" and len(polygonData[label]) != 4:
                            continue
                        data = [label] + polygonData[label]
                        self.commandTerminal.insertText(f'exporting {label}\n')
                        file.write(",".join(data))
                        file.write('\n')
                    file.close()
                self.commandTerminal.insertText("exported\n")
            case commands.clear:
                self.commandTerminal.setText("")
            case commands.test:
                for i in range(20):
                    dataKey = str(uuid.uuid4())
                    offX = random.randint(0, 2000)
                    offY = random.randint(0, 2000)
                    self.polygonHandler.addData(
                        dataKey,
                        f"{100+random.randint(0, 200)+offX},{100+random.randint(0, 200)+offY}"
                    )
                    self.polygonHandler.addData(
                        dataKey,
                        f"{100+random.randint(0, 200)+offX},{300+random.randint(0, 200)+offY}"
                    )
                    self.polygonHandler.addData(
                        dataKey,
                        f"{300+random.randint(0, 200)+offX},{300+random.randint(0, 200)+offY}"
                    )
                    self.polygonHandler.addData(
                        dataKey,
                        f"{300+random.randint(0, 200)+offX},{100+random.randint(0, 200)+offY}"
                    )
            case _:
                self.commandTerminal.insertText("unknown command\n")

        self.commandTerminal.insertText("[host]: ")
        self.commandline.delete("0", tk.END)
        print(inpt)

    def getFrame(self):
        return self.commandFrame

    def placeElement(self):
        self.commandFrame.place(x=0,y=0,relwidth=1,relheight=1)
        self.commandline.place(relx=0.0125,rely=0.0125,relwidth=0.975)
        self.commandTerminal.getRef().place(
                relx=0.0125,rely=0.125,relwidth=0.975,
                                   relheight=0.8625)


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
        if kwargs:
            print("kwag")
            self.element[name] = tkWidget(master, **kwargs)
        else:
            print("no kwag")
            self.element[name] = tkWidget(master=master)

    def placeElement(self, name, **kwargs):
        if name in self.element:
            self.element[name].place(kwargs)

    def configElement(self, name, **kwargs):
        if name in self.element:
            self.element[name].config(kwargs)

    def getElement(self, name):
        return self.element[name]

    def modifyReference(self, name, newRef):
        if name in self.element:
            self.element[name] = newRef

    def addReference(self, name, ref):
        self.element[name] = ref
