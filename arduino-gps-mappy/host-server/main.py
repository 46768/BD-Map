import platform
import argparse


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'

baudRate = 19200
print("Hekki Wolrd")

parser = argparse.ArgumentParser(
        prog="Mappy CLI",
        description="Command line tool for mappy the gps module",
        epilog="2024/2567 PBL/IS"
    )
parser.add_argument("-n", "--new")
