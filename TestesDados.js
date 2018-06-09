// SVG
var width = 1260;
var height = 4200;
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
	
	let scatterplots = [];
	for (let x in nomesFeatures) {
		let ordenado = csvData.sort((a, b)=>(parseFloat(a[nomesFeatures[x]]) - parseFloat(b[nomesFeatures[x]])));
		let atributos = {
			id: (d, i)=>d.name,
			cx: (d, i)=>scatterplots[x].xScale()(i),
			cy: (d, i)=>scatterplots[x].yScale()(parseFloat(d[nomesFeatures[x]])),
			r: "2.5px"
		};
		let eventos = {
			mouseover: function (d, i) {
				d3.select(this).attr("r", "5px");
				scatterplots[x].selection().append("text")
					.attr("class", "legendaPonto")
					.attr("x", d3.select(this).attr("cx"))
					.attr("y", d3.select(this).attr("cy") - 12)
					.attr("text-anchor", (3*i < ordenado.length) ? "start" : 
										(3*i < ordenado.length*2) ? "middle" : "end")
					.text(d.name);
			},
			mouseout: function (d, i) {
				d3.select(this).attr("r", "2.5px");
				scatterplots[x].selection().selectAll(".legendaPonto").remove();
			}
		}
		
		scatterplots[x] = new Scatterplot(svgTag, nomesFeatures[x], {x: (630 * x) % width, y: Math.trunc(x / 2) * 630}, 50, {"width": 630, "height": 630});
		// Nomes de cada gráfico
		scatterplots[x].selection().append("text")
			.text(nomesFeatures[x])
			.attr("x", scatterplots[x].width()/2)
			.attr("y", scatterplots[x].height()/2)
			.attr("fill", "gray")
			.attr("font-size", "30")
			.attr("text-anchor", "middle")
			.attr("dominant-baseline", "middle");
		// Todos os gráficos tem 1 ou mais funções similares a essa, ela recebe o dataset (ordenado), um objeto com funções para definir os atributos SVG (atributos) e um objeto com funções a serem chamadas para cada evento no ponto plotado (eventos)
		scatterplots[x].setData(ordenado, atributos, eventos);
	}
});