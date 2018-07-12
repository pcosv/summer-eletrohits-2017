function genLabelTable() {
	// Para criar uma labelTable eu preciso de um objeto Chart
	var dummychart = new Chart(svg);
	var labelTable = new LabelTable(new LabelTable(dummychart, "tabelaLegendas", {x: 0, y: height / 2 - 60}, 0, {width: 240, height: 120})
		.setValues(["#A100B2", "#00B52D", "#FFA900", "#004ECC", "#B21900"], ["America do Sul", "Americas do Norte e Central", "Europa", "Asia", "Oceania"]));
}

var svg = d3.select("#svgForce")
    width = +svg.attr("width"),
    height = +svg.attr("height");

genLabelTable();

var monthG = 1
var sizeG = 120

setTimeout(function() {
  createForce(monthG, sizeG);
}, 5000);

function prepareCreateForceMonth(monthV){
  monthG = monthV
}

function prepareCreateForceSize(sizeV){
  sizeG = sizeV
}

function prepareCreateForce(){
	svg.selectAll("*").remove();
	genLabelTable();
	createForce(monthG, sizeG);
}

var lealcsv = new Array();

d3.csv("Datasets/leal.csv", function(error, csv){
  lealcsv = csv;
});

function createForce(monthV, sizeV){
  // console.log(monthV)
  // console.log(sizeV)

  
  var dataMusic

  
	// console.log(error);
	// console.log("passou pelo erro");
  dataFilter = d3.nest()
    .key(function(d) { return d.region; })
    .key(function(d) { 
      return d.date.substring(0, 7); 
    })
    .key(function(d) { return d["id"]; })
    .entries(lealcsv);

    topMusic()

    function topMusic(){

      dataMusic = []

      for (var i = 0; i < dataFilter.length; i++) {
        dataMusic[i] = []
        for (var v = 0; v < dataFilter[i].values.length; v++) {

          var x = dataFilter[i].values[v].values
        
          var result = x.map(d=> 
            { var total = d3.sum(d.values.map(d=>d.Streams)) 
              return [d.key, total]
            }
           )
          var sortResult = result.sort(function (a, b) {
            return b[1]-a[1]
          })

          var resultTop = sortResult.slice(0,200)
          resultTop = resultTop.map(d=>d[0])

          if(v <= 12){
            dataMusic[i][v] = resultTop
          }
          //dataMusic[dataFilter[i].key][dataFilter[i].values[v].key] = resultTop

        }
      }

     // console.log(dataMusic)

    }

  c = ["ec", "fr", "ar", "fi", "no", "it", "ph", "tw", "nz", "ee", "tr", "us", "sv", "cr", "de", "cl", "jp", "br", "hn", "gt", "ch", "hu", "ca", "pe", "be", "my", "dk", "bo", "pl", "at", "pt", "se", "mx", "pa", "uy", "is", "es", "cz", "ie", "nl", "co", "sg", "id", "do", "gb", "py", "au", "lv", "gr", "hk"];

  countries = ["Equador", "França", "Argentina", "Finlândia", "Noruega", "Itália", "Filipinas", "Taiwan", "Nova Zelândia", "Estônia", "Turquia", "Estados Unidos da América", "El Salvador", "Costa Rica", "Alemanha", "Chile", "Japão", "Brasil", "Honduras", "Guatemala", "Suíça", "Hungria", "Canadá", "Peru", "Bélgica", "Malásia", "Dinamarca", "Bolívia", "Polônia", "Áustria", "Portugal", "Suécia", "México", "Panamá", "Uruguai", "Islândia", "Espanha", "República Tcheca", "Irlanda", "Holanda", "Colômbia", "Singapura", "Indonésia", "República Dominicana", "Reino Unido ", "Paraguai", "Austrália", "Letônia", "Grécia", "Hong-Kong"];

  //Luxemburgo, Lituania, Estonia, Eslovaquia

  //1 - America do Sul | 2 - America do Norte | 3 - Europa | 4 - Asia | 5 - Oceania
  countriesGroup = [1, 3, 1, 3, 3, 3, 4, 4, 5, 3, 3, 2, 2, 2, 3, 
  1, 4, 1, 2, 2, 3, 3, 2, 1, 3, 4, 3, 1, 3, 3, 3, 3, 2, 
  2, 1, 3, 3, 3, 3, 3, 1, 4, 4, 2, 3, 1, 5, 3, 3,
   4];

  var elements = [];
  for(var i = 0 ; i < countries.length; i++){
    var temp = {};
    temp.id = i;
    temp.group = countriesGroup[i]

    elements = elements.concat(temp);
  }

  var links = [];

  for(i = 0 ; i < dataMusic.length; i++){
    for(v = 0 ; v < dataMusic.length; v++){

    var temp = {};

    temp.source = i;
    temp.target = v;
    temp.value = linkCountries(dataMusic[i][monthV-1], dataMusic[v][monthV-1])

    if (temp.value >= sizeV){
      links = links.concat(temp);
    }

    }
  }

  //links = links.slice(0,200)

  //console.log(elements)
  //console.log(links)

  //Code

 /* var svg = d3.select("svg")
      width = +svg.attr("width"),
      height = +svg.attr("height");*/

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("center", d3.forceCenter(width / 2, height / 2));


    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value/20); });

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(elements)
      //.data(graph.nodes)
      .enter().append("circle")
        .attr("r", 7)
        .attr("fill", function(d) { 
          if (d.group == 1){
            return "#A100B2"; 
          }else if (d.group == 2){
            return "#00B52D"; 
          }else if (d.group == 3){
            return "#FFA900";   
          }else if (d.group == 4){
            return "#004ECC"; 
          }else{
            return "#B21900"; 
          }
          
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return countries[d.id]; });

    simulation
        .nodes(elements)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);
        //.links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


  

}

function linkCountries (arrC1, arrC2){
  var value = 0
  for (var i = 0; i < arrC1.length; i++) {
    for (var v = 0; v < arrC2.length; v++) {
      if (arrC1[i] == arrC2[v]){
        value = value + 1
      }
    }
  }
  return value
}