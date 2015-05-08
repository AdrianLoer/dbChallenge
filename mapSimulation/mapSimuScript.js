$(document).ready(function() {

 //    var map = new ol.Map({
 //        target: 'map',
 //        layers: [
 //          new ol.layer.Tile({
 //            source: new ol.source.MapQuest({layer: 'sat'})
 //          }),
 //          streckeLayer
 //        ],
 //        view: new ol.View({
 //          center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
 //          zoom: 4
 //        })
	// });

var pointSource = new ol.source.Vector({
})

var pointLayer = new ol.layer.Vector({
	source: pointSource
})


var vector = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: 'streckeJson.json',
		format: new ol.format.GeoJSON(),
		// projection: 'EPSG:31467',
		wrapX: false
	}),
	style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 10
    })
  })
});

var white = [255, 255, 255, 1];
var blue = [0, 153, 255, 1];
var width = 3;

var coordinates = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'coordinates.json',
    format: new ol.format.GeoJSON(),
    // projection: 'EPSG:31467',
    wrapX: false
  }),
  style: new ol.style.Style({
     image: new ol.style.Circle({
       radius: width * 2,
       fill: new ol.style.Fill({
         color: blue
       }),
       stroke: new ol.style.Stroke({
         color: white,
         width: width / 2
       })
     }),
     zIndex: Infinity
   })
});


// vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));

var mouseControl = new ol.control.MousePosition({
    projection: 'EPSG:4326'
});

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vector,
    coordinates,
    pointLayer
  ],
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      collapsible: false
    })
  }),
  controls: [mouseControl],
  view: new ol.View({
    center: ol.proj.transform([8.23009489802687,48.8713096877989], 'EPSG:4326', 'EPSG:3857'),
    zoom: 15
  })
});


window.coordinates = [];


map.on("click", function(event) {
    console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
    coordinates.push(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
    pointSource.addFeature(new ol.Feature(new ol.geom.Circle(event.coordinate, 100)));
})


});