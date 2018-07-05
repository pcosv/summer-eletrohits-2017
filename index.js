// SVGs

var timeAxisSVG = d3.select("#timeAxis");

var mapSelection = d3.select("body").append("svg")
	.attr("width", timeAxisSVG.attr("width"))
	.attr("height", 530);

