import platform
import argparse
import os
import uuid
import serialHandler


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'

baudRate = 19200
gpsAvg = 10
actions = {
    'polygon': ['new', 'list', 'add', 'del'],
}
polygonDataExist = os.path.exists('./export.csv')
polygonPointerExist = os.path.exists('./head')
polygonDataFile = open('./export.csv', 'r+', newline='\n')
polygonPointer = open('./head', 'r+')
polygonDataBuffer = ''.join([poly for poly in polygonDataFile]).split('\n')
polygonDataBuffer.pop()

serialPort = serialHandler.SerialHandler(port=port, baudRate=baudRate)
parser = argparse.ArgumentParser(
        prog="mappy",
        description="Command line tool for mappy the gps module",
        epilog="2024/2567 PBL/IS"
    )
parser.add_argument('action')
parser.add_argument('type')
parser.add_argument('-p', '--polygon')

args = parser.parse_args()
if actions.get(args.type) is None:
    print(f"Invalid type '{args.type}'")
    exit(1)

if args.action not in actions[args.type]:
    print(f"Invalid action '{args.action}' to type '{args.type}'")
    exit(1)

match args.type:
    case 'polygon':
        match args.action:
            case 'new':
                polygonID = uuid.uuid4()
                polygonDataFile.write(str(polygonID))
                polygonDataFile.write('\n')
                polygonPointer.truncate(0)
                polygonPointer.write(str(polygonID))
                print(f'Created new polygon: {polygonID}')
            case 'list':
                if not polygonDataExist:
                    print("No Polygon Data")
                else:
                    polyCount = len(polygonDataBuffer)
                    print(f"Total polygon: {polyCount}")
                    for poly in polygonDataBuffer:
                        print(poly)
            case 'add':
                print('Waiting for start signal')
                incommingPacket = (0, [])
                while incommingPacket[1] != serialHandler.commsHeader.gpsStart:
                    incommingPacket = serialPort.read()
                print(f'Recieved start signal, logging gps {gpsAvg} times')
                pass
            case 'del':
                polygonDataFile.truncate(0)
                polygonPointer.truncate(0)
                print('Cleared polygon data file')

polygonDataFile.close()
polygonPointer.close()
