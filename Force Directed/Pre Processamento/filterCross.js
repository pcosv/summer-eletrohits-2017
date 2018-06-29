var cf = undefined;

d3.csv("data.csv", function(csv){
	var x = csv
	cf = crossfilter(csv);

	var nameDimension = cf.dimension(function(d){
		//return d["Track Name"];
		return d["Position"];
	});
/*
	var ageDifferenceDimension = cf.dimension(function(d){
		return d["pAge"]-d["vAge"];
	});
*/
	nameDimension.filter(function(d){
		
		return d == 1;
	});
/*
	var perpetratorSexDimension = cf.dimension(function(d){
		return d["pSex"];
	});
	
	perpetratorSexDimension.filter|(function(d){
		return d == "Female";
	});*/
	
	//Chave principal
	var regionDimension = cf.dimension(function(d){
		return d.Region;
	});

	var regionDimension = regionDimension.group();

	console.log(regionDimension.top(3));

});

