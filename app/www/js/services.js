angular.module('starter.services', [])

.factory('GPSService', function() {

})

.factory('MapService', function() {

  var currentPositionSource;
  var currentPositionLayer;

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

    currentPositionSource.addFeature(new ol.Feature(new ol.geom.Circle(ol.proj.transform([8.22297990218418,48.8648350817261], 'EPSG:4326', 'EPSG:3857'), 100)));
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
        pointLayer,
        currentPositionLayer
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

    map.on("click", function(event) {
        console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        // coordinates.push(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        pointSource.addFeature(new ol.Feature(new ol.geom.Circle(event.coordinate, 100)));
    })
  }


  function translateCurrentPosition(newCoordinates) {
    currentPositionSource.getFeatures()[0].setCenter(newCoordinates);
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
