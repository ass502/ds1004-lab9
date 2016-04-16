var xchange = function() {

  sel1 = this.value
  
  //Compute x scale domain
  x.domain(d3.extent(dataset, function(d) { return d[sel1]; })).nice();

  //Change the x axis
  svg.select(".x_axis") 
    .call(xAxis);

  //Join new data with old elements
  var pts = svg.selectAll(".point").data(dataset);

  //pts.enter().append("class", "old");

  pts.attr("class", "point")
      .attr("d", d3.svg.symbol().type("circle"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; });

  //pts.exit().transition().attr("old").remove();

};


var ychange = function() {


  sel2 = this.value
  //Compute y scale domain
  y.domain(d3.extent(dataset, function(d) { return d[sel2]; })).nice();

  svg.select(".y_axis") // change the x axis
    .call(yAxis);

  //Join new data with old elements
  var pts = svg.selectAll(".point").data(dataset);

  //pts.enter().append("class", "old");

  pts.attr("class", "point")
      .attr("d", d3.svg.symbol().type("circle"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; });

  pts.exit().transition().attr("old").remove();

};


//Start building the page

//Make sel1 and sel2 global variables
var sel1 = 0
var sel2 = 0

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var svg = d3.select("body").select(".plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left");

var dataset = [];
d3.csv('car.csv', function(data) {

  var columnNames = Object.keys(data[0]);
  columnNames.splice(0,1);
  columnNames.splice(columnNames.length-1);

  var listX = d3.select("#sel-x").on('change',xchange).selectAll("option").data(columnNames).enter().append("option").text(function(d){return d;})
      .attr("value",function(d){return d;});

  var listY = d3.select("#sel-y").on('change',ychange).selectAll("option").data(columnNames).enter().append("option").text(function(d){return d;})
      .attr("value",function(d){return d;});

  //draw the plot once with default values
  sel1 = d3.select("#sel-x").node().value;
  sel2 = d3.select("#sel-y").node().value;

  //var mpg_min = d3.select("#mpg_min").attr("type","text").attr("value",0).attr("size",10);
  document.getElementById('mpg-min').setAttribute('type','text');
  document.getElementById('mpg-min').setAttribute('value','0');
  document.getElementById('mpg-min').setAttribute('size','10');

  document.getElementById('mpg-max').setAttribute('type','text');
  document.getElementById('mpg-max').setAttribute('value','30');
  document.getElementById('mpg-max').setAttribute('size','10');

  mpg_min = d3.select("#mpg-min").node().value;
  mpg_max = d3.select("#mpg-max").node().value;

  data.forEach(function(d){

    dataset.push({
      "name": d.name,
      "mpg": +d.mpg,
      "cylinders": +d.cylinders,
      "displacement": +d.displacement,
      "horsepower": +d.horsepower,
      "weight": +d.weight,
      "acceleration": +d.acceleration,
      "model.year": +d['model.year'],
    });

  });

  new_dataset = dataset.filter(function (row) {
  return row.mpg <= mpg_max &&
         row.mpg >= mpg_min;
  });
  
  //Draw the plot once with default values:
  // Compute the scales’ domains.
  x.domain(d3.extent(dataset, function(d) { return d[sel1]; })).nice();
  y.domain(d3.extent(dataset, function(d) { return d[sel2]; })).nice();

  // Add the x-axis.
  svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  // Add the y-axis.
  svg.append("g")
      .attr("class", "y_axis")
      .call(yAxis);

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add the points
  svg.selectAll(".point")
      .data(new_dataset)
    .enter().append("path")
      .attr("class", "point")
      .attr("d", d3.svg.symbol().type("circle"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; })
      //.attr("test", function(d) {return d["name"]})
      .on("mouseover", function(d) {
          d3.select('#hovered').text('Car name: ' + d["name"]);
      })
      .on("mouseout", function(d){
          d3.select('#hovered').text('Roll over a point to see it\'s car name.');
          //console.log(10)
      });
  });


