var cf = undefined;
var dataFilter

d3.csv("data.csv", function(error, csv){
	var x = csv
	//cf = crossfilter(csv);

	dataFilter = d3.nest()
	.key(function(d) { return d.Region; })
	.key(function(d) { 
		return d.Date.substring(0, 7); 
	})
	.key(function(d) { return d["URL"]; })
	.entries(csv);

	console.log(dataFilter)

	topMusic()

	function topMusic(){
		var x = dataFilter[0].values[0].values
		//var result = d3.sum(x[0].values.map(d=>d.Streams))
		var result = x.map(d=> 
			{ var total = d3.sum(d.values.map(d=>d.Streams)) 
				return [d.key, total]
			}
		 )
		var sortResult = result.sort(function (a, b) {
			return b[1]-a[1]
		})

		var resultTop = sortResult.slice(0,200)

		console.log(resultTop)

	}

	//x = dataFilter[0].values[0].values
	//Streams
	//x[0].values[0].Streams
/*
	var nameDimension = cf.dimension(function(d){
		//return d["Track Name"];
		return d["Position"];
	});

	var ageDifferenceDimension = cf.dimension(function(d){
		return d["pAge"]-d["vAge"];
	});

	nameDimension.filter(function(d){
		
		return d == 1;
	});

	var perpetratorSexDimension = cf.dimension(function(d){
		return d["pSex"];
	});
	
	perpetratorSexDimension.filter|(function(d){
		return d == "Female";
	});
	
	//Chave principal
	var regionDimension = cf.dimension(function(d){
		return d.Region;
	});

	var trackNameDimension = cf.dimension(function(d){
		return d["Track Name"];
	});

	var regionDimension = regionDimension.group();

	console.log(regionDimension.top(3));*/

});

