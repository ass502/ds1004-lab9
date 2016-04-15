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
 // console.log(dataset)

        });




