var map = new ol.Map({
    target: 'myMap',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      // center: ol.proj.fromLonLat([37.41, 8.82]),
      center: ol.proj.fromLonLat([-95, 45]), //USA
      zoom: 4
    })
  });