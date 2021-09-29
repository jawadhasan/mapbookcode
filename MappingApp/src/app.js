
//1. Begin with Coordinates
var markerCoords = [6.861427,51.258013];//Location in Dusseldorf, Germany

//2. Create a point geometry using coordinates
var point = new ol.geom.Point(ol.proj.fromLonLat(markerCoords));

//2.5 Create a style
var stroke = new ol.style.Stroke({color:'black', width:2});
var greenFill = new ol.style.Fill({color:'green'});

//style = square shape
var sequareStyle = new ol.style.Style({
  image: new ol.style.RegularShape({
      fill: greenFill,
      stroke: stroke,
      points: 4,
      radius:10,
      angle: Math.PI/4 //angle is in radian: so => for 45 degree rotation
  })
});

//another example: style = triangle
var triangle = new ol.style.Style({
  image: new ol.style.RegularShape({
    fill: greenFill,
    stroke: stroke,
    points: 3,
    radius: 10,
    rotation: Math.PI / 4,
    angle: 0,
  })
});


//3. Create a feature, whose geometry is that point.
var feature = new ol.Feature({
  geometry: point
});
feature.setId('LuckemeyerStrasse'); //giving feature an id
feature.setStyle(sequareStyle); 

//3.5***********Add a second feature */
var markerCoords2 = [10.538269913664841, 52.25263461177347];
var point2 = new ol.geom.Point(ol.proj.fromLonLat(markerCoords2));
var feature2 = new ol.Feature({
  geometry: point2
});
feature2.setId('Braunschweig HBF'); //giving feature an id
feature2.setStyle(triangle); 


//4. Create a source which houses the feature(s)
myVectorSource = new ol.source.Vector({
  features: [feature, feature2]
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

  map.on('click', function(evt){

      map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
        alert(feature.getId());
      })
  });