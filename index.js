// SVG
var svgTag = d3.select("body").append("svg")
	.attr("width", 800)
	.attr("height", 400);
	
// Mapa
var mapa = new Map(svgTag, "mapa", null, 2, null);

// Geojson
d3.json("custom.geojson", function(error, geoData) {
	console.log(geoData);
	
	mapa.fillValue((d, i)=>0);
	mapa.projection(d3.geoNaturalEarth1());
	mapa.setMap(geoData, {id: (d, i)=>d.properties.name});
	
	// Csv
	d3.csv("filteredData.csv", function(erro, csvData) {
		let set = new Set(csvData.map(d=>d['Region']));
		
		// Atualmente, o mapa mostra apenas os países dos quais temos dados
		// Obs.: Não sei exatamente o que são as siglas de "Region", mas elas coincidiram com 51 das siglas em iso_a2, então estou usando isso
		let data = geoData.features.map(d=>set.has(d.properties.iso_a2.toLowerCase()));
		// Preto == Temos dados, Bege: Não temos
		mapa.fillValue((d, i)=> d ? 0 : 1);
		mapa.setData(data, null, null);
	});
});