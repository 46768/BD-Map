#!/bin/sh
emcc="/bin/emcc" 
astar="./c-astar"

if [ ! -f $emcc ]; then
	echo emcc does not exist
	exit 127
fi

$astar/build.sh
