#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import numpy as np
import json

# LEITURA DO DATASET COM O RANKING DIÁRIO DAS MÚSICAS
with open("data.csv", newline = '', encoding="utf-8") as data:
	spamreader = csv.reader(data, delimiter = ',')
	# Set das melhores músicas.
	urls = set()
	regions = []
	for row in spamreader:
		if (row[4][31:] not in urls):
			regions.append(row[6])
		urls.add(row[4][31:])
	urls.remove("")
	print(regions[0])
	regions.pop(0)
	
	print("URLs das melhores músicas:", urls)
	print("Nº de URLs:", len(urls))
	print("Tamanho de regions:", len(regions))
	
	# ESCRITA DO JSON COM AS URLS DAS MÚSICAS
	with open("urls.json", 'w', newline = '', encoding="utf-8") as saida:
		lista = []
		buffer = []
		for url in urls:
			buffer.append([url, regions.pop(0)])
			if len(buffer) == 100:
				lista.append(buffer)
				buffer = []
		json.dump(lista, saida)