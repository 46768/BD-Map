#!/bin/bash

cd bd-map
chmod +x csvStatic.sh
./csvStatic.sh && npm run build-only

if [ -d ./dist ]; then
	mv ./dist ..
fi
