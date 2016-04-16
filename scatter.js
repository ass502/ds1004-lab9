var xchange = function() {

  var new_sel1 = this.value
  
  //Compute x scale domain
  x.domain(d3.extent(dataset, function(d) { return d[new_sel1]; })).nice();

  //Change the x axis
  svg.select(".x_axis") 
    .call(xAxis);

  //Join new data with old elements
  var pts = svg.selectAll(".point").data(dataset);

  //Update old elements as needed
  pts.attr("class", "update").remove();

  //Enter: create new elements
  pts.enter().append("path")
      .attr("class", "point")
      .attr("d", d3.svg.symbol().type("triangle-up"))
      .attr("transform", function(d) { return "translate(" + x(d[new_sel1]) + "," + y(d[sel2]) + ")"; });

  //pts.remove();

  //pts.exit().remove();

  /*
  // Add the points!
  svg.selectAll(".point")
      .data(dataset)
    .enter().append("path")
      .attr("class", "point")
      .attr("d", d3.svg.symbol().type("triangle-up"))
      .attr("transform", function(d) { return "translate(" + x(d[new_sel1]) + "," + y(d[sel2]) + ")"; });

   */   
  //svg.selectAll('.point').remove()

};


var ychange = function() {

  //console.log(10)

  var new_sel2 = this.value
  //Compute y scale domain
  y.domain(d3.extent(dataset, function(d) { return d[new_sel2]; })).nice();

  svg.select(".y_axis") // change the x axis
    .call(yAxis);

  /*
  //Add the y axis
  svg.append("g")
      .attr("class", "y_axis")
      .call(d3.svg.axis().scale(y).orient("left"));
  */

  //Add the points
  svg.selectAll(".point")
      .data(dataset)
    .enter().append("path")
      .attr("class", "point")
      .attr("d", d3.svg.symbol().type("triangle-up"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[new_sel2]) + ")"; });

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
  
  //Draw the plot once with default values:
  // Compute the scales’ domains.
  x.domain(d3.extent(dataset, function(d) { return d[sel1]; })).nice();
  y.domain(d3.extent(dataset, function(d) { return d[sel2]; })).nice();

  // Add the x-axis.
  svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(d3.svg.axis().scale(x).orient("bottom"));
      .call(xAxis);
  // Add the y-axis.
  svg.append("g")
      .attr("class", "y_axis")
      //.call(d3.svg.axis().scale(y).orient("left"));
      .call(yAxis);


  // Add the points!
  svg.selectAll(".point")
      .data(dataset)
    .enter().append("path")
      .attr("class", "point")
      .attr("d", d3.svg.symbol().type("triangle-up"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; });

  });

