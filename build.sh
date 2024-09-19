#!/bin/sh

cd bd-map
pwd
npm ci
chmod +x csvStatic.sh
./csvStatic.sh && npm run build-only

if [ -d ./dist ]; then
	if [ -d ../dist ]; then
		rm -rf ../dist
	fi
	mv ./dist ..
fi
