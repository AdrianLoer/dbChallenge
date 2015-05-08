angular.module('starter.services', [])

.factory('GPSService', function($http, MapService) {

  var gpsTrackData;

  function start() {

    console.log("service start");

      var counter = 0;
      $http.get('data/gps_track.json').success(function(data) {
      console.log(data);
      gpsTrackData = data;

      setInterval(function() {
        console.log(gpsTrackData.features[counter++].geometry.coordinates);
        MapService.updatePosition(gpsTrackData.features[counter++].geometry.coordinates)
      }, 1000);
    });


  }

  return {
    start: start
  }

})

.factory('MapService', function() {

  var currentPositionSource;
  var currentPositionLayer;
  var map;

  function init() {


    currentPositionSource = new ol.source.Vector({

    })

    currentPositionLayer = new ol.layer.Vector({
      source: currentPositionSource
    })


    var pointSource = new ol.source.Vector({
    })

    var pointLayer = new ol.layer.Vector({
      source: pointSource
    })


    var vector = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: 'data/streckeJson.json',
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

    currentPositionSource.addFeature(new ol.Feature(new ol.geom.Circle(ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857'), 100)));
    // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));

    var mouseControl = new ol.control.MousePosition({
        projection: 'EPSG:4326'
    });

        var white = [255, 255, 255, 1];
    var blue = [0, 153, 255, 1];
    var red = [255, 0, 0, 1];
    var width = 3;

    var coordinates = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: 'data/coordinates.json',
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

    map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vector,
        pointLayer,
        currentPositionLayer,
        coordinates
      ],
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      controls: [mouseControl],
      view: new ol.View({
        center: ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15
      })
    });

    window.coordinates = [];

    map.on("click", function(event) {
        console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        window.coordinates.push(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        pointSource.addFeature(new ol.Feature(new ol.geom.Circle(event.coordinate, 100)));
    })



  }


  function translateCurrentPosition(newCoordinates) {
    // console.log(currentPositionSource.getFeatures());
    currentPositionSource.clear();

    currentPositionSource.addFeature(new ol.Feature(new ol.geom.Circle(ol.proj.transform(newCoordinates, 'EPSG:4326', 'EPSG:3857'), 100)));
    map.getView().setCenter(ol.proj.transform(newCoordinates, 'EPSG:4326', 'EPSG:3857'), 100);
  }

  function updatePosition(newCoordinates) {
    translateCurrentPosition(newCoordinates);
    // TODO: calculate
  }

  return {
    init: init,
    updatePosition: updatePosition
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
