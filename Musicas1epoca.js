//--------------- FUNÇÕES ---------------

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

// Busca em um array nested todos os valores mapeados por uma data dentro de um determinado intervalo.
function queryDate(nest, minDate, maxDate) {
	let output = []
	for (date in nest) {
		let splittedDate = date.split("-");
		splittedDate[0] = splittedDate[0].substring(1);
		splittedDate = splittedDate.map(Number);
		
		if (splittedDate.length == 3) {
			let formattedDate = new Date(splittedDate[0], splittedDate[1] - 1, splittedDate[2]);
			if ((minDate <= formattedDate) && (formattedDate <= maxDate)) {
				output.push(nest[date]);
			}
		}
	}
	return d3.merge(output);
}

// Gera as médias de cada país.
function generateMeans(countriesMusic, musicFeats, attribute, period) {
	period = period ? period : [new Date(2017, 0, 1), new Date(2017, 0, 7)];
	return countriesMusic.map(d=>{
		if (d) {
			let dateNest = d3.nest()
				.key(d=>d.Date)
				.map(d);
			let queryResult = queryDate(dateNest, period[0], period[1]);
			let musicStreams = queryResult.map(e=>Number(e.Streams));
			let musicIds = queryResult.map(e=>e.URL.substring(31, e.URL.length - 1));
			let avgValence = calculateMean(musicStreams, musicIds.map(e=>musicFeats["$" + e][0][attribute]));
			return avgValence;
		}
	});
}

//Atualiza o mapa
function updateMap() {
	let averageFeats = generateMeans(countriesMusic, musicFeats, shownAttribute, timeRange);
	mapa.colorScale().domain(minMax[shownAttribute]);
	mapa.fillValue((d, i)=>d)
		.fillFunction(d=>(d ? mapa.colorScheme()(mapa.colorScale()(mapa.fillValue()(d))) : "#00000010"))
		.colorScheme(d3.scaleLinear().domain([0, .5, 1]).range(["#fde0dd", "#fa9fb5", "#c51b8a"]))
		.setData(averageFeats, {stroke: d=>(d ? "black" : "transparent")}, {
			mouseover: (d, i)=>{
				mapa.selection().append("text")
					.text(d ? (mapa.pathSelection().filter((_, j)=>(j==i)).attr("id") + ": " + d3.format(".3f")(d)) : undefined)
					.attr("class", "legendaMapa")
					.attr("dominant-baseline", "hanging");
				},
			mouseout: (d, i)=>mapa.selection().selectAll(".legendaMapa").remove()
		});
}

//--------------- VARIAVEIS ---------------

var timeAxisSVG = d3.select("#timeAxis");

var svgSelection = d3.select("body").append("svg")
	.attr("width", timeAxisSVG.attr("width"))
	.attr("height", 530);

var timeRange;

var mapa;

var shownAttribute;
var countriesMusic;
var musicFeats;
var minMax;
	
//--------------- CÓDIGO ---------------

d3.json("custom.geojson", (erro, jsonData)=>{
	mapa = new Map(svgSelection, null, null, 2, null)
		.projection(d3.geoNaturalEarth1())
		.fillFunction((d, i)=>"#00000010")
		.setMap(jsonData, {id: (d, i)=>d.properties.name});
	let countriesList = jsonData.features.map(d=>d.properties.iso_a2.toLowerCase());
	d3.csv("filteredData.csv", (erro, csvData)=>{
		countriesMusic = getCountriesMusics(countriesList, csvData);
		d3.csv("featuresdf.csv", (erro, csvFeatures)=>{
			musicFeats = d3.nest()
				.key(d=>d.id)
				.map(csvFeatures);
			minMax = [];
			["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"]
				.map(d=>(minMax[d] = d3.extent(generateMeans(countriesMusic, musicFeats, d))));
			
			// Altera o mapa quando um novo atributo é selecionado
			d3.selectAll("input").on("change", function() {
				shownAttribute = this.value;
				updateMap();
			});
		});
	});
});

var timeAxisScale = d3.scaleTime()
	.domain([new Date(2017, 0, 1), new Date(2018, 0, 9)])
	.range([0, Number(timeAxisSVG.attr("width"))])

let timeAxis = d3.axisBottom(timeAxisScale);
timeAxisSVG.call(timeAxis);

let timeAxisBrush = d3.brushX();
timeAxisSVG.call(timeAxisBrush);
timeAxisBrush.on("end", function() {
	timeRange = (d3.event.selection) ? d3.event.selection.map(d=>timeAxisScale.invert(d)) : null;
	if (shownAttribute) updateMap();
});