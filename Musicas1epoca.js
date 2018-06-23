// Obtem um array onde, para cada posição i da lista de países, há um array com as músicas tocadas naquele país na posição i dele.
function getCountriesMusics(countriesList, data) {
	let rankNest = d3.nest()
		.key(d=>d.Region)
		.map(data);
	return countriesList.map(d=>rankNest["$" + d]);
}

// Calcula a média ponderada de um atributo.
function calculateMean(weights, values) {
	let sum = 0;
	for (i = 0; i < values.length; i++) {
		sum += weights[i]*values[i];
	}
	return sum / d3.sum(weights);
}

// Gera as médias de cada país.
function generateMeans(countriesMusic, musicFeats) {
	return countriesMusic.map(d=>{
		if (d) {
			let dateNest = d3.nest()
				.key(d=>d.Date)
				.map(d);
			let musicStreams = dateNest["$2017-01-01"].map(e=>Number(e.Streams));
			let musicIds = dateNest["$2017-01-01"].map(e=>e.URL.substring(31, e.URL.length - 1));
			let avgValence = calculateMean(musicStreams, musicIds.map(e=>musicFeats["$" + e][0].valence));
			return avgValence;
		}
	});
}

var svgSelection = d3.select("body").append("svg")
	.attr("width", 1200)
	.attr("height", 600);

var mapa = new Map(svgSelection, null, null, 2, null)
	.projection(d3.geoNaturalEarth1());

d3.json("custom.geojson", (erro, jsonData)=>{
	mapa.setMap(jsonData, {id: (d, i)=>d.properties.name});
	let countriesList = jsonData.features.map(d=>d.properties.iso_a2.toLowerCase());
	d3.csv("filteredData.csv", (erro, csvData)=>{
		let countriesMusic = getCountriesMusics(countriesList, csvData);
		d3.csv("featuresdf.csv", (erro, csvFeatures)=>{
			let musicFeats = d3.nest()
				.key(d=>d.id)
				.map(csvFeatures);
			let averageFeats = generateMeans(countriesMusic, musicFeats);
			
			mapa.colorScale().domain(d3.extent(averageFeats));
			mapa.fillValue((d, i)=>d)
				.fillFunction(d=>(d ? mapa.colorScheme()(mapa.colorScale()(mapa.fillValue()(d))) : "transparent"))
				.setData(averageFeats, null, {
					mouseover: (d, i)=>{
						mapa.selection().append("text")
							.text(d)
							.attr("class", "legendaMapa")
							.attr("dominant-baseline", "hanging");
					},
					mouseout: (d, i)=>mapa.selection().selectAll(".legendaMapa").remove()
				});
		});
	});
});