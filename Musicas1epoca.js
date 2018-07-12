//--------------- FUNÇÕES ---------------

// Obtem um array onde, para cada posição i da lista de países, há um array com as músicas tocadas naquele país na posição i dele.
function getCountriesMusics(countriesList, data) {
	let rankNest = d3.nest()
		.key(d=>d.Region)
		.key(d=>d.Date)
		.map(data);
	return countriesList.map(d=>rankNest["$" + d]);
}

// Calcula a média ponderada de um atributo.
function calculateMean(weights, values) {
	return values.reduce((output, cur, i)=>(output + cur * weights[i]), 0) / d3.sum(weights);
}

// Busca em um array nested todos os valores mapeados por uma data dentro de um determinado intervalo.
function queryDate(nest, minDate, maxDate) {
	let output = [];
	for (let currDate = new Date(minDate); currDate <= maxDate; currDate.setHours(24)) {
		let currDateString = "$" + (currDate.getFullYear() - 2010) + "-" + currDate.getMonth() + "-" + currDate.getDate();
		if (nest[currDateString]) output.push(nest[currDateString]);
	}
	return d3.merge(output);
}

// Gera as médias de cada país.
function generateMeans(countriesMusic, musicFeats, attribute, period) {
	period = period ? period : [new Date(2017, 0, 1), new Date(2018, 0, 9)];
	return countriesMusic.map(d=>{
		if (d) {
			let queryResult = queryDate(d, period[0], period[1]);
			//console.log(queryResult);
			return queryResult.reduce((output, cur, i)=>(output + cur.Streams * musicFeats[cur.URL][attribute]), 0)
					/ queryResult.reduce((output, cur)=>(output + cur.Streams), 0);
		}
	});
}

//Atualiza o mapa
function updateMap() {
	let averageFeats = generateMeans(countriesMusic, musicFeats, shownAttribute, shownTimeRange);
	mapa.colorScale().domain(minMax[shownAttribute]);
	mapa.fillFunction(d=>(d ? mapa.colorScheme()(mapa.colorScale()(mapa.fillValue()(d))) : "#00000020"))
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

var mapSelection = d3.select("body").append("svg")
	.attr("width", timeAxisSVG.attr("width"))
	.attr("height", 551);

var shownTimeRange;

var mapa = new Map(mapSelection, null, null, 2, null)
	.projection(d3.geoNaturalEarth1())
	.fillFunction((d, i)=>"#00000020")
	.fillValue((d, i)=>d)
	.colorScheme(d3.scaleLinear().domain([0, .5, 1]).range(["#fde0dd", "#fa9fb5", "#c51b8a"]));

var shownAttribute;
var countriesMusic;
var musicFeats;
var minMax;
	
//--------------- CÓDIGO ---------------

d3.json("custom.geojson", (erro, jsonData)=>{
	//console.log(jsonData);
	mapa.setMap(jsonData, {id: (d, i)=>d.properties.name});
	let countriesList = jsonData.features.map(d=>d.properties.iso_a2.toLowerCase());
	d3.csv("Datasets/mapData.csv", (erro, csvData)=>{
		csvData.map(d=>{
			d.Streams = Number(d.Streams);
		});//Formatação do número de streams
		countriesMusic = getCountriesMusics(countriesList, csvData);
		d3.csv("Datasets/featuresdf.csv", (erro, csvFeatures)=>{
			musicFeats = csvFeatures
			
			minMax = [];
			["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"]
				.map(d=>(minMax[d] = d3.extent(generateMeans(countriesMusic, musicFeats, d))));
			//console.log(minMax);
			
			// Altera o mapa quando um novo atributo é selecionado
			d3.select("#visualizacao").selectAll("input").on("change", function() {
				shownAttribute = this.value;
				updateMap();
			});
		});
	});
});

var timeAxisScale = d3.scaleTime()
	.domain([new Date(2017, 0, 1), new Date(2018, 0, 9)])
	.range([0, Number(timeAxisSVG.attr("width"))]);

var timeAxisFunction = function() {
	shownTimeRange = (d3.event.selection) ? d3.event.selection.map(d=>timeAxisScale.invert(d)) : null;
	if (shownAttribute) updateMap();
};

timeAxisSVG.call(d3.axisBottom(timeAxisScale));
timeAxisSVG.call(
	d3.brushX()
		.on("brush", timeAxisFunction)
		.on("end", timeAxisFunction)
);