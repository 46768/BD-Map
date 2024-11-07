import platform
import argparse
import os
import uuid
import serialHandler
import gps


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

# File handling stuff
if not os.path.exists('./data/'):
    os.mkdir('./data/')
polygonDataExist = os.path.exists('./data/export.csv')
polygonPointerExist = os.path.exists('./data/head')
if not polygonDataExist:
    open('./data/export.csv', 'w', newline='\n').close()
if not polygonPointerExist:
    open('./data/head', 'w').close()
polygonDataFile = open('./data/export.csv', 'r+', newline='\n')
polygonPointerFile = open('./data/head', 'w+')
polygonDataBuffer = ''.join([poly for poly in polygonDataFile]).split('\n')  # DO NOT REMOVE
polygonDataBuffer.pop()
polygonPointer = [ptr for ptr in polygonPointerFile]
polygonPointer = polygonPointer[0] if len(polygonPointer) > 0 else ''

serialPort = serialHandler.SerialHandler(port=port, baudRate=baudRate)
gpsParser = gps.GPSHandler()
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
                polygonPointerFile.write(str(polygonID))
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
                if serialPort is None:
                    print('Mappy not connected')
                    exit(1)
                print('Waiting for start signal')
                incommingPacket = (0, [])
                while incommingPacket[0] != bytes([serialHandler.commsHeader.gpsStart]):
                    incommingPacket = serialPort.read()
                print('mappy automatically started, waiting for manual startup')
                incommingPacket = (0, [])
                while incommingPacket[0] != bytes([serialHandler.commsHeader.gpsStart]):
                    incommingPacket = serialPort.read()
                print(f'Recieved start signal, logging gps {gpsAvg} times')
                print(f'adding vertex to {polygonPointer}')
                gpsCnt = 0
                gpsLastUpt = gpsParser.upt
                vertexCoord = [0, 0]
                while gpsCnt < gpsAvg:
                    gpsParser.readPacket(serialPort.read())
                    curGpsUpt = gpsParser.upt
                    if curGpsUpt != gpsLastUpt and gpsParser.isValid:
                        print(f'averaging {gpsParser.lat}, {gpsParser.lng}')
                        vertexCoord[0] += gpsParser.lat
                        vertexCoord[1] += gpsParser.lng
                        gpsLastUpt = curGpsUpt
                        # print(f'average upt: {gpsParser.upt}, last upt: {gpsLastUpt}')

                        gpsCnt += 1
                vertexCoord[0] /= gpsAvg
                vertexCoord[1] /= gpsAvg
                print(f'recorded vertex at {vertexCoord[0]}, {vertexCoord[1]}')

            case 'del':
                polygonDataFile.truncate(0)
                polygonPointerFile.truncate(0)
                print('Cleared polygon data file')

polygonDataFile.close()
polygonPointerFile.close()
