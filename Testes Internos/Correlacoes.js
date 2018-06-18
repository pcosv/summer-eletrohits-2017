// SVG
var width = 675;
var height = 675;
var svgTag = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

d3.csv("featuresdf.csv", function(erro, csvData) {
	console.log(csvData);
	let nomesFeatures = [];
	for (let nome in csvData[0]) {
		nomesFeatures.push(nome);
	}
	// Removendo id, name e artists, já que só atributos quantitativos são plotados
	nomesFeatures.shift();
	nomesFeatures.shift();
	nomesFeatures.shift();
	
	let raw = csvData.map(d=>{
		let i = 0;
		let output = [];
		for (let x in nomesFeatures) {
			output[i] = Number(d[nomesFeatures[x]]);
			i++;
		}
		return output;
	});
	console.log(raw);
	let eventos = {
		mouseover: function (d, i) {
			console.log("Mouseover");
			console.log(d + ", " + i);
			d3.select(this)
				.attr("fill", "#ffffff80");
			correlation.selection().append("text")
				.attr("class", "legendaCelula")
				.attr("x", -correlation.margins().top)
				.attr("y", -correlation.margins().left)
				.attr("dominant-baseline", "hanging")
				.text(d);
		},
		mouseout: function (d, i) {
			console.log("Mouseout");
			d3.select(this)
				.attr("fill", "#00000000")
			d3.select(".legendaCelula").remove();
		}
	};
	var correlation = new Correlation(svgTag, "id", null, {top: 90, left: 90, right: 0, bottom: 0}, null)
		.setData(raw, null, eventos)
		.setLabels(nomesFeatures);
});