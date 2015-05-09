angular.module('starter.services', [])

.factory('ShareService', function() {
  var message;

  return {
    setMessage: function(msg) {
      message = msg;
    },
    getMessage: function() {
      return message;
    }
  }
})

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

.factory('GPSService', function($http, MapService, $rootScope) {

  var gpsTrackData;
  var interval;

  function start() {

    $rootScope.$broadcast("createPidObject");

    console.log("service start");

      var counter = 0;
      $http.get('data/gps_track.json').success(function(data) {
      console.log(data);
      gpsTrackData = data;

      interval = setInterval(function() {
        // console.log(gpsTrackData.features[counter++].geometry.coordinates);
        if (gpsTrackData.features[counter] !== undefined) {
          MapService.updatePosition(gpsTrackData.features[counter++].geometry.coordinates)
        }
      }, 100);
    });


  }

  $rootScope.$on("GPSServicestop", function() {
    clearInterval(interval);
  })

  function stop() {
    clearInterval(interval);
  }

  return {
    start: start,
    stop: stop
  }

})

.factory('MapService', function($rootScope, ShareService) {

  var currentPositionSource;
  var currentPositionLayer;
  var map;
  var oldPosition;
  var attractionsVector;
  var gesamtstreckenVector;
  var attractionsPtVector;
  var attractionsPtVectorObject = {};

  var yellowDotsToRedLinesSource;
  var yellowDotsToRedLinesLayer

  // $rootScope.$on("createPidObject", function() {
  //   console.log("broadcast");
  //   var attractionsPtVectorFeatures = attractionsPtVector.getSource().getFeatures();
  //   console.log()

  //   for (var i = 0; i < attractionsPtVectorFeatures.length; i++) {
  //     console.log("loop");
  //     attractionsPtVectorObject[attractionsPtVectorFeatures[i].gid] = attractionsPtVectorFeatures[i];
  //   }

  // })


  function init() {


    currentPositionSource = new ol.source.Vector({

    })


    currentPositionLayer = new ol.layer.Vector({
      source: currentPositionSource,
      style: attractionsPtStyle
    })


    var pointSource = new ol.source.Vector({
    })

    var pointLayer = new ol.layer.Vector({
      source: pointSource
    })

    // currentPositionSource.addFeature(new ol.Feature(new ol.geom.Point(ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857'))));
    // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));

    var mouseControl = new ol.control.MousePosition({
        projection: 'EPSG:4326'
    });

    var white = [255, 255, 255, 1];
    var blue = [0, 153, 255, 1];
    var red = [255, 0, 0, 1];
    var width = 3;

    // var coordinates = new ol.layer.Vector({
    //   source: new ol.source.Vector({
    //     url: 'data/coordinates.json',
    //     format: new ol.format.GeoJSON(),
    //     // projection: 'EPSG:31467',
    //     wrapX: false
    //   }),
    //   style: new ol.style.Style({
    //      image: new ol.style.Circle({
    //        radius: width * 2,
    //        fill: new ol.style.Fill({
    //          color: blue
    //        }),
    //        stroke: new ol.style.Stroke({
    //          color: white,
    //          width: width / 2
    //        })
    //      }),
    //      zIndex: Infinity
    //    })
    // });

    var gesamtstreckenStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(113, 12, 81, 0.4)',
        width: 10
      })
    });
    gesamtstreckenVector = createWFSLayer('gesamtstrecken_pm', gesamtstreckenStyle, ['strecke_nr%3D4020%20']);
    // gesamtstreckenVector = createWFSLayer('gesamtstrecken_3857', gesamtstreckenStyle);

    var attractionsStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 20
      })
    });
    attractionsVector = createWFSLayer('attractions_attached_segments', attractionsStyle, ['strecke_nr%3D4020%20']);
    // attractionsVector = createWFSLayer('attractions_attached_segments', attractionsStyle);


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
    var attractionsPtStyle2 = new ol.style.Style({
       image: new ol.style.Circle({
         radius: width * 2,
         fill: new ol.style.Fill({
           color: 'blue'
         }),
         stroke: new ol.style.Stroke({
           color: white,
           width: width / 2
         })
       }),
       zIndex: Infinity
     });

    attractionsPtVector = createWFSLayer('attractions_point_pm', attractionsPtStyle2);

    yellowDotsToRedLinesSource = new ol.source.Vector({

    })

    yellowDotsToRedLinesLayer = new ol.layer.Vector({
      source: yellowDotsToRedLinesSource,
      style: attractionsPtStyle
    })

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
        // coordinates,
        attractionsVector,
        attractionsPtVector,
        yellowDotsToRedLinesLayer
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
        // center: ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857'),
        center: ol.proj.transform([8.45370788902995,49.026232005884], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12
      })
    });

    attractionsPtVector.setOpacity(0);
    // oldPosition = ol.proj.transform([8.45793722305512,49.4816210554485], 'EPSG:4326', 'EPSG:3857');
    oldPosition = ol.proj.transform([8.45370788902995,49.026232005884], 'EPSG:4326', 'EPSG:3857');

    window.coordinates = [];

    map.on("click", function(event) {
        // console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        // // window.coordinates.push(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        // pointSource.addFeature(new ol.Feature(new ol.geom.Circle(event.coordinate, 100)));
    });

  }

  function createWFSLayer(tableName, style, cqlQueries) {
    var wfsFormat = new ol.format.WFS();

    cqlQueries = cqlQueries || [];

    var vectorSource = new ol.source.Vector({
      format: new ol.format.WFS({
        featureNS: 'http://disy.net',
        featureType: tableName
      }),
      loader: function(extent, resolution, projection) {
        var cql = cqlQueries.concat(['BBOX(geometry%2C%20' + extent.join('%2C%20') + ')']).join('%20and%20');
        var url = 'http://192.168.0.2:8080/geoserver/db_hack/wfs?'+
          'service=WFS&request=GetFeature&'+
          'version=1.1.0&typeName=db_hack:' + tableName + '&' +
          'srsname=EPSG:3857&CQL_FILTER=' + cql;
        $.ajax({
          url: url
        })
        .done(function(response) {
          vectorSource.addFeatures(wfsFormat.readFeatures(response));
        });
      },
      strategy: ol.loadingstrategy.bbox,
      projection: 'EPSG:3857'
    });

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

    currentPositionSource.addFeature(new ol.Feature(new ol.geom.Point(ol.proj.transform(newCoordinates, 'EPSG:4326', 'EPSG:3857'))));
    map.getView().setCenter(ol.proj.transform(newCoordinates, 'EPSG:4326', 'EPSG:3857'));
  }

  function updatePosition(newCoordinates) {
    translateCurrentPosition(newCoordinates);
    console.log(attractionsVector.getSource().getFeatures());
    console.log(gesamtstreckenVector.getSource().getFeatures());
    console.log(attractionsPtVector.getSource().getFeatures());

    findIntersectingAngles(ol.proj.transform(newCoordinates, 'EPSG:4326', 'EPSG:3857'), attractionsVector.getSource().getFeatures());

    // TODO: calculate
  }

  var pointCtrlObj = {};

  function findIntersectingAngles(currentCoordinates, features) {
    var intersecingFeatures = [];
    var closestPointToLineString;
    var distance;

    for (var i = 0; i < features.length; i++) {
      // console.log(features[i]);
      closestPointToLineString = features[i].values_.geometry.getClosestPoint(currentCoordinates);
      // console.log(closestPointToLineString + "  ---  " + currentCoordinates);
      distance = Math.sqrt(Math.pow(currentCoordinates[0]-closestPointToLineString[0], 2) + Math.pow(currentCoordinates[1]-closestPointToLineString[1], 2));
      // console.log(distance);
      if (distance < 300) {
        console.log("stop");
        // $rootScope.$broadcast("GPSServicestop");
        var p_id = features[i];
        var pointFeatures = attractionsPtVector.getSource().getFeatures();
        for (var j = 0; j < pointFeatures.length; j++) {
          if (pointFeatures[j].values_.gid === p_id.values_.p_id) {
            if (!pointCtrlObj[p_id.values_.p_id]) {
              pointCtrlObj[p_id.values_.p_id] = true;
              console.log(pointFeatures[j]);
              ShareService.setMessage(pointFeatures[j]);
              yellowDotsToRedLinesSource.addFeature(pointFeatures[j]);
              $rootScope.$broadcast("cardUpdated");
            }
          }
        }

        // console.log(attractionsPtVectorObject);
        // console.log(attractionsPtVectorObject[p_id]);
        // yellowDotsToRedLinesSource.addFeature(attractionsPtVectorObject[p_id]);
      }
    }
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
