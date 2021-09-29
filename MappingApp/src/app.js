
//1. Begin with Coordinates
var markerCoords = [6.861427,51.258013];//Location in Dusseldorf, Germany

//2. Create a point geometry using coordinates
var point = new ol.geom.Point(ol.proj.fromLonLat(markerCoords));

//3. Create a feature, whose geometry is that point.
var feature = new ol.Feature({
  geometry: point
});
feature.setId('mylocation'); //giving feature an id

//4. Create a source which houses the feature(s)
myVectorSource = new ol.source.Vector({
  features: [feature]
});

//5. create a vector layer which uses that source
var myVectorLayer = new ol.layer.Vector({ 
  source: myVectorSource,
});


//6. All left to do, is to add this vectorLayer to the list of layers for the map.


var map = new ol.Map({
    target: 'myMap',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      myVectorLayer
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([6.783333, 51.233334]), //Dusseldorf, Germany
      zoom: 4
    })
  });