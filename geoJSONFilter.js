var fs = require('fs');


	fs.readFile("attractions_de.json", 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  var file = JSON.parse(data);
	  var newFile = {
	  	type: "FeatureCollection",
	  	features: []
	  }

	  for (var i = 0; i < file.features.length; i++) {
	  	newFile.features.push(
	  		{
	  			properties: {
	  		name: file.features[i].properties.name,
	  		operator: file.features[i].properties.operator
	  	},
	  	geometry: file.features[i].geometry
	  }
	  );
	  }

	  fs.writeFile('./attractions_de_filtered.json', JSON.stringify(newFile), function (err) {
	  if (err) return console.log(err);
	});
	});