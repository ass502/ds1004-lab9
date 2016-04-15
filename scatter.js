var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataset = [];
d3.csv('car.csv', function(data) {

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
  
  // Compute the scales’ domains.
  x.domain(d3.extent(dataset, function(d) { return d.mpg; })).nice();
  y.domain(d3.extent(dataset, function(d) { return d.cylinders; })).nice();
  // Add the x-axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
  // Add the y-axis.
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));
  // Add the points!
  svg.selectAll(".point")
      .data(dataset)
    .enter().append("path")
      .attr("class", "point")
      .attr("d", d3.svg.symbol().type("triangle-up"))
      .attr("transform", function(d) { return "translate(" + x(d.mpg) + "," + y(d.cylinders) + ")"; });



  console.log(dataset)

  });