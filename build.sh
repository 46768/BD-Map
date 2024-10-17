#!/bin/sh

cd frontend
pwd
npm ci
chmod +x csvStatic.sh
./csvStatic.sh && npm run build

if [ -d ./dist ]; then
	if [ -d ../dist ]; then
		rm -rf ../dist
	fi
	mv ./dist ..
fi
