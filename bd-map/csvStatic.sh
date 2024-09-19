#!/bin/bash

cd public
mkdir data

graphCsv = $(ls ./map.data | grep -E 'v[0-9]+\.graph\.csv' | sort -V | tail -n 1)
graphicCsv = $(ls ./map.data | grep -E 'v[0-9]+\.graphic\.csv' | sort -V | tail -n 1)
translationCsv = $(ls ./map.data | grep -E 'v[0-9]+\.translation\.csv' | sort -V | tail -n 1)

mv $graphCsv ./data && mv ./data/$graphCsv ./data/graph.csv
mv $graphicCsv ./data && mv ./data/$graphicCsv ./data/graphic.csv
mv $translationCsv ./data && mv ./data/$translationCsv ./data/translation.csv
