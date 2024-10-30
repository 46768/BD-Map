import applicationTK
import tkinter as tk
from tkinter import ttk


def makeApp():
    def mkApp():
        # Root Structure
        app = applicationTK.Application("Mappy Host Module", "1280x640")
        app.addElement("MapFrame", tk.LabelFrame, app.root, text="Map")
        app.addElement("PolygonFrame", tk.LabelFrame, app.root,
                       text="Polygon Monitor")

        # Root Structure Placement
        app.placeElement("MapFrame", x=0, y=0, relheight=0.7, relwidth=0.8)
        app.placeElement("PolygonFrame", relx=0.8, y=0, relheight=1,
                         relwidth=0.2)

        # Map Frame Structure
        app.addElement(
                "MapCanvas", applicationTK.ExtendedCanvas,
                app.element["MapFrame"],
                confine=False, bg="white"
                )

        # Map Frame Rereference
        app.addReference("MapCanvasRef", app.element["MapCanvas"].getCanvas())

        # Map Frame Placement
        app.placeElement("MapCanvasRef", relx=0.005, rely=0.005,
                         relwidth=0.99, relheight=0.99)

        # Polygon Frame Structure
        app.addElement("PolygonTree", applicationTK.ExtendedTreeview,
                       app.element["PolygonFrame"])

        # Polygon Frame Placement
        app.element["PolygonTree"].placeElement()

        # Variable Definition
        PolygonTree: applicationTK.ExtendedTreeview = app.element[
            "PolygonTree"
        ]

        # Interface Structure
        app.addElement("InterfaceNotebook", ttk.Notebook, app.root)

        # Interface Placement
        app.placeElement("InterfaceNotebook", x=0, rely=0.7,
                         relheight=0.3, relwidth=0.8)

        # Serial Notebook Child Structure
        app.addElement("SerialText", applicationTK.ExtendedText,
                       app.element["InterfaceNotebook"])
        app.addElement("HostLog", applicationTK.ExtendedText,
                       app.element["InterfaceNotebook"])
        app.addElement("MicroLog", applicationTK.ExtendedText,
                       app.element["InterfaceNotebook"])
        app.addElement("GPSLog", applicationTK.ExtendedText,
                       app.element["InterfaceNotebook"])
        app.addElement("CLI", applicationTK.CommandLine,
                       app.element["InterfaceNotebook"],
                       polygonHandler=PolygonTree)

        # Serial Notebook Child Rereference
        app.addReference("SerialTextRef", app.element["SerialText"].getRef())
        app.addReference("HostLogRef", app.element["HostLog"].getRef())
        app.addReference("MicroLogRef", app.element["MicroLog"].getRef())
        app.addReference("GPSLogRef", app.element["GPSLog"].getRef())

        # Serial Frame Child Placement
        app.placeElement("SerialTextRef", relx=0.025, rely=0.025,
                         relwidth=0.95, relheight=0.95)
        app.placeElement("HostLogRef", relx=0.025, rely=0.025,
                         relwidth=0.95, relheight=0.95)
        app.placeElement("MicroRef", relx=0.025, rely=0.025,
                         relwidth=0.95, relheight=0.95)
        app.placeElement("GPSRef", relx=0.025, rely=0.025,
                         relwidth=0.95, relheight=0.95)
        app.element["CLI"].placeElement()

        # Notebook Child addition
        app.element["InterfaceNotebook"].add(app.element["SerialTextRef"],
                                             text="Serial Input")
        app.element["InterfaceNotebook"].add(app.element["HostLogRef"],
                                             text="Host Log")
        app.element["InterfaceNotebook"].add(app.element["MicroLogRef"],
                                             text="Micro Log")
        app.element["InterfaceNotebook"].add(app.element["GPSLogRef"],
                                             text="GPS Log")
        app.element["InterfaceNotebook"].add(app.element["CLI"].getFrame(),
                                             text="CLI")
    mkApp()
