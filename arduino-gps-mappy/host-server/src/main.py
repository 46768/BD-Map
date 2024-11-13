import platform
import argparse
import os
import uuid
import random
import serialHandler
import gps
import re


port = '/dev/ttyUSB0'  # 'dev/ttyUSB0' on linux
if platform.system() == "Linux":
    port = '/dev/ttyUSB0'
elif platform.system() == "Windows":
    port = 'COM3'

baudRate = 19200
gpsAvg = 10
actions = {
    'polygon': ['new', 'list', 'del', 'sel', 'test'],
    'vertex': ['add', 'sel'],
}

polygonDataPath = os.path.abspath('./data/export.csv')
polygonPointerPath = os.path.abspath('./data/head')
# File handling stuff
if not os.path.exists('../data/'):
    os.mkdir('../data/')
polygonDataExist = os.path.exists(polygonDataPath)
polygonPointerExist = os.path.exists(polygonPointerPath)

if not polygonDataExist:
    open(polygonDataPath, 'w', newline='\n').close()
if not polygonPointerExist:
    open(polygonPointerPath).close()


polygonData = [
    polyDat.split(';') for polyDat in open(
        polygonDataPath
    ).read().split('\n')
]
polygonPointer = open(polygonPointerPath).read()
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
    case 'vertex':
        match args.action:
            case 'add':
                if serialPort is None:
                    print('Mappy not connected')
                    exit(1)
                print('Waiting for start signal')
                serialPort.waitUntilHeader(serialHandler.commsHeader.gpsStart)
                print('mappy started, waiting for manual startup')
                serialPort.waitUntilHeader(serialHandler.commsHeader.gpsStart)
                print(f'''
                    Recieved start signal, logging gps {gpsAvg} times
                    Adding vertex to {polygonPointer}
                ''')
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

                        gpsCnt += 1
                vertexCoord[0] /= gpsAvg
                vertexCoord[1] /= gpsAvg
                # GPS data at vertexCoord
                print(f'recorded vertex at {vertexCoord[0]}, {vertexCoord[1]}')
                for poly in polygonData:
                    if poly[0] == polygonPointer:
                        poly.append(f'{vertexCoord[0]},{vertexCoord[1]}')
            case 'sel':
                pass
    case 'polygon':
        match args.action:
            case 'new':
                polygonID = uuid.uuid4()
                polygonData.append([str(polygonID)])
                polygonPointer = str(polygonID)
                print(f'Created new polygon: {polygonID}')
            case 'list':
                if not polygonDataExist or polygonData == []:
                    print("No Polygon Data")
                    exit(1)
                print(f'Total polygon: {len(polygonData)}\n')
                for poly in polygonData:
                    if poly[0] == polygonPointer:
                        print('>>>', poly[0])
                    else:
                        print(poly[0])
            case 'del':
                polygonData = []
                polygonPointer = ''
                print('Cleared polygon data file')
            case 'sel':
                if args.polygon is None:
                    print('Polygon to select isnt provided')
                    exit(1)
                found = False
                for poly in polygonData:
                    if re.search(args.polygon, poly[0]) is not None:
                        print(f'found polygon {poly[0]}')
                        polygonPointer = poly[0]
                        found = True
                if not found:
                    print('Polygon not found')
            case 'test':
                for i in range(20):
                    polygonID = uuid.uuid4()
                    [x, y] = [
                        random.randint(-1000, 1000),
                        random.randint(-1000, 1000)
                    ]

                    [w, h] = [
                        random.randint(0, 500),
                        random.randint(0, 500)
                    ]
                    polygonData.append([
                        str(polygonID),
                        f'{x},{y}',
                        f'{x+w},{y}',
                        f'{x+w},{y+w}',
                        f'{x},{y+w}',
                    ])
                    polygonPointer = str(polygonID)
                    pass
                pass

polygonDataFile = open(polygonDataPath, mode='w')
polygonPointerFile = open(polygonPointerPath, mode='w')
dataContent = '\n'.join(map((lambda p: ';'.join(p)), polygonData))
if len(dataContent) > 0 and dataContent[0] == '\n':
    dataContent = dataContent[1:]
polygonDataFile.write(dataContent)
polygonPointerFile.write(polygonPointer)
polygonDataFile.close()
polygonPointerFile.close()
