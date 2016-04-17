//Function that updates chart when x-axis is changed
var xchange = function() {

  sel1 = this.value
  
  //Compute x scale domain
  x.domain(d3.extent(new_dataset, function(d) { return d[sel1]; })).nice();

  //Change the x axis
  svg.select(".x_axis") 
    .call(xAxis);

  //Join new data with old elements
  var pts = svg.selectAll(".point").data(new_dataset);

  pts.attr("class", "point")
      .attr("d", d3.svg.symbol().type("circle"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; });
};


//Function that updates chart when y-axis is changed
var ychange = function() {

  sel2 = this.value

  //Compute y scale domain
  y.domain(d3.extent(new_dataset, function(d) { return d[sel2]; })).nice();

  svg.select(".y_axis") // change the x axis
    .call(yAxis);

  //Join new data with old elements
  var pts = svg.selectAll(".point").data(new_dataset);

  pts.attr("class", "point")
      .attr("d", d3.svg.symbol().type("circle"))
      .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; });
};


//Function that updates chart when the "Query MPG" button is pressed
var set_mpg = function(){

  mpg_min = d3.select("#mpg-min").node().value;
  mpg_max = d3.select("#mpg-max").node().value;

  new_dataset = dataset.filter(function (row) {
  return row.mpg <= mpg_max &&
         row.mpg >= mpg_min;
  });

  // Compute the scales’ domains.
  x.domain(d3.extent(new_dataset, function(d) { return d[sel1]; })).nice();
  y.domain(d3.extent(new_dataset, function(d) { return d[sel2]; })).nice();

  //Change the x and y axes
  svg.select(".x_axis") 
    .call(xAxis);

  svg.select(".y_axis") // change the x axis
    .call(yAxis);


  var pts = svg.selectAll(".point")
      .data(new_dataset);

  pts.enter().append("path")
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

  pts.exit().remove();
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


//Create a button variable that calls the set_mpg function everytime the button is clicked
var button = d3.select("#update").on('click',set_mpg)

//Set these up temporarily? not sure if we can get around them being global
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
x.domain(d3.extent(new_dataset, function(d) { return d[sel1]; })).nice();
y.domain(d3.extent(new_dataset, function(d) { return d[sel2]; })).nice();

// Add the x-axis.
svg.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
// Add the y-axis.
svg.append("g")
    .attr("class", "y_axis")
    .call(yAxis);

// Add the points
svg.selectAll(".point")
    .data(new_dataset)
  .enter().append("path")
    .attr("class", "point")
    .attr("d", d3.svg.symbol().type("circle"))
    .attr("transform", function(d) { return "translate(" + x(d[sel1]) + "," + y(d[sel2]) + ")"; })
    .on("mouseover", function(d) {
        d3.select('#hovered').text('Car name: ' + d["name"]);
    })
    .on("mouseout", function(d){
        d3.select('#hovered').text('Roll over a point to see it\'s car name.');
    });
});


