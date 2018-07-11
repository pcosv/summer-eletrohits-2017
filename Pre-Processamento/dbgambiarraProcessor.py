#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import numpy as np;

with open("extractedFeatures.csv", newline = '', encoding="utf-8") as csvFeatures:
	# Obtenção das features
	featurereader = csv.reader(csvFeatures, delimiter = ',')
	features = dict();
	for row in featurereader:
		temp = [row[1]]
		temp.extend(row[3:])
		features[row[0]] = temp
	print(features)
	with open("data.csv", newline = '', encoding="utf-8") as csvData:
		with open("dbgambiarra.csv", 'w', newline = '', encoding="utf-8") as saida:
			# Inclusão dos dados no csv
			datareader = csv.reader(csvData, delimiter = ',')
			spamwriter = csv.writer(saida, delimiter = ',')
			spamwriter.writerow(["Position", "Track Name", "Artist", "Streams", "ID", "Date", "Region", "artist_id", "genres", "energy", "instrumentalness", "liveness", "loudness", "speechiness", "valence", "danceability", "acousticness", "tempo"])
			for row in datareader:
				if (row[4][31:] in features):
					row[4] = row[4][31:]
					row.extend(features[row[4]])
					spamwriter.writerow(row)