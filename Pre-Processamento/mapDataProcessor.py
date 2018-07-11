#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import numpy as np
from pathlib import Path

# RAIZ DO PROJETO
d = str(Path().resolve().parent)

# LEITURA DO DATASET COM AS INFORMAÇÕES DAS MÚSICAS
with open(d + "\\Datasets\\featuresdf.csv", newline = '', encoding="utf-8") as features:
	spamreader = csv.reader(features, delimiter = ',')
	# Set das melhores músicas. Tambem contem "id", mas não é problema pq todas as urls tem bem mais que 2 caracteres
	ids = set()
	for row in spamreader:
		ids.add(row[0])
	print("IDs das melhores músicas:", ids)
	print("Nº de IDs:", len(ids))
	
	# LEITURA DO DATASET COM O RANKING DIÁRIO DAS MÚSICAS
	with open(d + "\\Datasets\\data.csv", newline = '', encoding="utf-8") as data:
		spamreader = csv.reader(data, delimiter = ',')
		with open(d + "\\Datasets\\mapData.csv", 'w', newline = '', encoding="utf-8") as saida:
			spamwriter = csv.writer(saida, delimiter = ',')
			# Primeira linha do csv, com os nomes das colunas
			spamwriter.writerow(["Streams", "URL", "Date", "Region"])
			for row in spamreader:
				# As IDs tem um caractere faltando no final, então desconsidero um das URLs pra compensar
				if row[4][31:-1] in ids:
					row[4] = row[4][31:-1]
					spamwriter.writerow(row[3:])