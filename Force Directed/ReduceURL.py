#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import numpy as np;

with open("data.csv", newline = '', encoding="utf-8") as csvData:
	with open("reducedData.csv", 'w', newline = '', encoding="utf-8") as saida:
		datareader = csv.reader(csvData, delimiter = ',')
		spamwriter = csv.writer(saida, delimiter = ',')
		
		for row in datareader:
			if (len(row[4][31:])):
				row[4] = row[4][31:]
			spamwriter.writerow(row)