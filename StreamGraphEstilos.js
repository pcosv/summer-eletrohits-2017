var segmentsSVG = d3.select("body").append("svg")
	.attr("width", 1260)
	.attr("height", 640);
var segments = new Segments(segmentsSVG, null, null, {top: 3, bottom: 20, left: 10, right: 7}, null);
//segments.rangePathGenerator().curve(d3.curveNatural);
var streamMode = true;

d3.select("#stream").selectAll("input").on("change", function() {
	streamMode = (this.value == "Linear");
});

d3.csv("paula.csv", (erro, csvData)=>{
	//console.log(csvData);
	let nestedData = d3.nest()
		.key(d => d.country)
		.key(d => d.key)
		.map(csvData);
	d3.selectAll("select").on("change", function() {
		// Limpando tudo antes de plotar coisas
		segments
			.clear()
			.yScale().domain([0, 1]);
		
		// Gerando os valores das ranges
		let ranges = [];
		let acumulo = Chart.genSequence(0, 53, 0);
		let novoAcumulo;
		for (let key in nestedData["$" + this.value]) {
			if (key[0] == "$") {
				if (streamMode) novoAcumulo = nestedData["$" + this.value][key].map((d, i)=>(acumulo[i] + Number(d.value)));
				else novoAcumulo = nestedData["$" + this.value][key].map((d, i)=>(acumulo[i] + Number(d.value) ** (1/2)));
				ranges.push(acumulo.map((d, i)=>[acumulo[i], novoAcumulo[i]]));
				acumulo = novoAcumulo;
			}
		}
		let keys = [...nestedData["$" + this.value].keys()];
		//console.log(ranges);
		
		// Plotagem
		segments.xAxisScale(
			d3.scaleOrdinal()
				.domain(Chart.genSequence(0, 53, 52))
				.range(Chart.genSequence(0, 53, segments.width()))
			)
			.setRanges(ranges, {id: (_, i)=>keys[i]}, {
				mouseover: function (d, i) {
					segments.selection().append("text")
						.text(segments.rangeSelection().filter((_, j)=>(j==i)).attr("id"))
						.attr("class", "legendaRange")
						.attr("x", 5)
						.attr("dominant-baseline", "hanging");
					d3.select(this).attr("stroke", "black");
				},
				mouseout: function (d, i) {
					segments.selection().selectAll(".legendaRange").remove();
					d3.select(this).attr("stroke", "transparent");
				}
			});
	});
});