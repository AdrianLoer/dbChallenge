angular.module('starter.services', [])

.factory('CardService', function() {
  var infoCards = [];

  function addCard(card) {
    infoCards.push(card);
  }

  return {
    getCards: infoCards,
    addCard: addCard
  }
})

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
  var oldPosition


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

    var gesamtstreckenStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 10
      })
    });
    var gesamtstreckenVector = createWFSLayer('gesamtstrecken_3857', gesamtstreckenStyle, ['strecke_nr%3D4020%20']);

    var attractionsStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 20
      })
    });
    var attractionsVector = createWFSLayer('attractions_attached_segments', attractionsStyle, ['strecke_nr%3D4020%20']);

    var attractionsPtStyle = new ol.style.Style({
         image: new ol.style.Circle({
           radius: width * 2,
           fill: new ol.style.Fill({
             color: 'orange'
           }),
           stroke: new ol.style.Stroke({
             color: white,
             width: width / 2
           })
         }),
         zIndex: Infinity
       });
    var attractionsPtVector = createWFSLayer('attractions_point_pm', attractionsPtStyle);


    // var saveStrategy = new OpenLayers.Strategy.Save();

    // var wfs = new OpenLayers.Layer.Vector("Editable Features", {
    //     strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
    //     projection: new OpenLayers.Projection("EPSG:4326"),
    //     protocol: new OpenLayers.Protocol.WFS({
    //         version: "1.1.0",
    //         srsName: "EPSG:4326",
    //         url: "http://demo.boundlessgeo.com/geoserver/wfs",
    //         featureNS :  "http://opengeo.org",
    //         featureType: "restricted",
    //         geometryName: "the_geom",
    //         schema: "http://demo.boundlessgeo.com/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=og:restricted"
    //     })
    // });



    map = new ol.Map({
      layers: [
        // new ol.layer.Tile({
        //   source: new ol.source.OSM()
        // }),
        new ol.layer.Tile({
          source: new ol.source.BingMaps({
            key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
            imagerySet: 'Aerial'
          })
        }),
        gesamtstreckenVector,
        pointLayer,
        currentPositionLayer,
        coordinates,
        attractionsVector,
        attractionsPtVector
        // wfs
      ],
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      interactions: [],
      controls: [mouseControl],
      view: new ol.View({
        center: ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15
      })
    });

    oldPosition = ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857');

    window.coordinates = [];

    map.on("click", function(event) {
        console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        window.coordinates.push(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        pointSource.addFeature(new ol.Feature(new ol.geom.Circle(event.coordinate, 100)));
    });

  }

  function createWFSLayer(tableName, style, cqlQueries) {
    var geojsonFormat = new ol.format.GeoJSON();

    cqlQueries = cqlQueries || [];

    var vectorSource = new ol.source.Vector({
      loader: function(extent, resolution, projection) {
        console.log( cqlQueries.concat(['BBOX(geometry%2C%20' + extent.join('%2C%20') + ')']));
        var cql = cqlQueries.concat(['BBOX(geometry%2C%20' + extent.join('%2C%20') + ')']).join('%20and%20');
        console.log(cql);
        var url = 'http://192.168.0.2:8080/geoserver/db_hack/wfs?service=WFS&' +
            'version=1.0.0&request=GetFeature&typeName=db_hack:' + tableName + '&' +
            'outputFormat=text/javascript&format_options=callback:loadFeatures_' + tableName + '&' +
            'CQL_FILTER=' + cql + '&' +
            'srsname=EPSG:3857';
        $.ajax({url: url, dataType: 'jsonp', jsonp: false});
      },
      strategy: ol.loadingstrategy.bbox
    });

    window['loadFeatures_' + tableName] = function(response) {
      vectorSource.addFeatures(geojsonFormat.readFeatures(response));
    };

    return new ol.layer.Vector({
      source: vectorSource,
      style: style
    });
  }


  function translateCurrentPosition(newCoordinates) {
    var deltaX = oldPosition[0] - newCoordinates[0];
    var deltaY = oldPosition[1] - newCoordinates[1];

    console.log(deltaX);
    console.log(deltaY);
    var angle = Math.atan2(deltaY, deltaX);
    map.getView().setRotation(angle + Math.PI / 2);
    console.log("angle " + angle * 180 / Math.PI);
    // console.log(currentPositionSource.getFeatures());
    oldPosition = newCoordinates;
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
