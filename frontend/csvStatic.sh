#!/bin/sh

cd public
pwd

if [ ! -d ./data ]; then
	mkdir data
fi

graphCsv="$(ls ./map.data | grep -E 'v[0-9]+\.graph\.csv' | sort -V | tail -n 1)"
graphicCsv="$(ls ./map.data | grep -E 'v[0-9]+\.graphic\.csv' | sort -V | tail -n 1)"
translationCsv="$(ls ./map.data | grep -E 'v[0-9]+\.translation\.csv' | sort -V | tail -n 1)"

echo $graphCsv
echo $graphicCsv
echo $translationCsv

cp ./map.data/$graphCsv ./data && mv ./data/$graphCsv ./data/graph.csv
cp ./map.data/$graphicCsv ./data && mv ./data/$graphicCsv ./data/graphic.csv
cp ./map.data/$translationCsv ./data && mv ./data/$translationCsv ./data/translation.csv
rm -r ./map.data/
