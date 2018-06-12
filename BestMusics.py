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
	for row in spamreader:
		urls.add(row[4][31:])
	urls.remove("");
	
	print("URLs das melhores músicas:", urls)
	print("Nº de URLs:", len(urls))
	
	# ESCRITA DO JSON COM AS URLS DAS MÚSICAS
	with open("urls.json", 'w', newline = '', encoding="utf-8") as saida:
		lista = []
		buffer = []
		for url in urls:
			buffer.append(url)
			if len(buffer) == 100:
				lista.append(buffer)
				buffer = []
		json.dump(lista, saida)