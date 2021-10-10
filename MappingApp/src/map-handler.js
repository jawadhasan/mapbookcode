//MapHandler
var MapHandler = (function () {

    //constructor
    function MapHandler() {
        this.map;
        this.truckDataHandlerArray = [];
        this.layerData = new LayerData(this.truckDataHandlerArray);
    }


    MapHandler.prototype.Test = function () {
        var truckDataHandler = this.truckDataHandlerArray[0];
        truckDataHandler.updateTruckPosition(this.layerData, 52.533976, 13.156240);
     }

    MapHandler.prototype.loadTruckMapJsonData = function (json) {
        for (var tr = 0; tr < json.data.length; tr++) {
            var truckJson = json.data[tr];
            var truckDataHandler = new TruckDataHandler(truckJson);
            this.truckDataHandlerArray.push(truckDataHandler);
        }
        this.layerData.buildTruckTrackLayers();
        this.layerData.buildTruckMarkerLayers();
    };

    MapHandler.prototype.createMap = function () {

        var osmLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        // Create latitude and longitude and convert them to default projection
        var berlin = ol.proj.transform([13.138977, 52.527610], 'EPSG:4326', 'EPSG:3857');
        // Create a View, set it center and zoom level
        var view = new ol.View({
            center: berlin,
            zoom: 6
        });
        // Instanciate a Map, set the object target to the map DOM id
        this.map = new ol.Map({
            target: 'myMap'
        });
        // Add the created layer to the Map
        this.map.addLayer(osmLayer);

        this.map.addLayer(this.layerData.truckTrackLayer);
        this.map.addLayer(this.layerData.truckTrackMarkerLayer);

        this.map.addLayer(this.layerData.truckPositionLayer);
        this.map.addLayer(this.layerData.truckInformationMarkerLayer);

        // Set the view for the map
        this.map.setView(view);  
        var inst = this;

        this.map.on('click', function (evt) {
            inst.onClick(evt.pixel);
         });

         this.map.on('pointermove', function (evt) {
            if (evt.dragging) {
               info.tooltip('hide')
               return;
            }
            var pixel = inst.map.getEventPixel(evt.originalEvent);
            inst.onMouseOver(pixel);
         });

    };
   
    MapHandler.prototype.onClick = function (pixel) {
        var inst = this;
        var feature = this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
           console.log("Click");
           return feature;
        });
     };
  

     MapHandler.prototype.onMouseOver = function (pixel) { 
        var inst = this;
        var text;

        var feature = this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
           return feature;
        });

        if (feature) {
            var properties = feature.getProperties()
            if (properties.type == "tr") {
               console.log(properties);
               text = properties.registrationNumber;
            }
            else if (properties.type == "ts") {
               console.log("TS: " + properties.timestamp);
               text = properties.timestamp;
            }
            else if (properties.type == "po") {
                console.log('po');
                var truckDataHolder = this.findTruckById(properties.id);
                this.layerData.buildTruckTrackLayers(truckDataHolder);
                //text = properties.registrationNumber;
             }          
         }      

         if(text) {
             console.log('text: ', text);
            info.css({
               left: pixel[0] + 'px',
               top: (pixel[1] - 15) + 'px'
            });
            info.tooltip('hide')
             .attr('data-original-title', text)
             .tooltip('fixTitle')
             .tooltip('show');
         } else {
            info.tooltip('hide');
         }
   
        //console.log(pixel);
     };


     MapHandler.prototype.findTruckById = function (id) {
        for (var i = 0; i < this.truckDataHandlerArray.length; i++) {
           var truckDataHandler = this.truckDataHandlerArray[i];
           if (truckDataHandler.id == id)
              return truckDataHandler;
        }
        return null;
     };
  

    return MapHandler;

})();

//LayerData
var LayerData = (function () {

    function LayerData(truckDataHandlerArray) {
        this.truckDataHandlerArray = truckDataHandlerArray;

        this.truckPositionLayer = new ol.layer.Vector();
        this.truckInformationMarkerLayer = new ol.layer.Vector();

        this.truckTrackLayer = new ol.layer.Vector();
        this.truckTrackMarkerLayer = new ol.layer.Vector();
    }

    LayerData.prototype.buildTruckTrackLayers = function (truckHandler) {
        var trackMarkerVectorSource = new ol.source.Vector();
        var trackLineVectorSource = new ol.source.Vector();
        if (truckHandler) {
            trackMarkerVectorSource.addFeatures(truckHandler.truckTrackMarkerFeatures);
            trackLineVectorSource.addFeatures(truckHandler.truckTrackFeatures);
        }
        else {
            for (var tr = 0; tr < this.truckDataHandlerArray.length; tr++) {
                truckHandler = this.truckDataHandlerArray[tr];
                trackMarkerVectorSource.addFeatures(truckHandler.truckTrackMarkerFeatures);
                trackLineVectorSource.addFeatures(truckHandler.truckTrackFeatures);
            }
        }

        this.truckTrackMarkerLayer.setSource(trackMarkerVectorSource);

        this.truckTrackLayer.setSource(trackLineVectorSource);
        this.truckTrackLayer.setStyle(this.getTruckLineStyleFunction);
    };

    LayerData.prototype.buildTruckMarkerLayers = function () {
        var truckPositionMarkerVectorSource = new ol.source.Vector();
        var truckInformationMarkerVectorSource = new ol.source.Vector();

        for (var tr = 0; tr < this.truckDataHandlerArray.length; tr++) {
            var truckDataHandler = this.truckDataHandlerArray[tr];
            truckPositionMarkerVectorSource.addFeature(truckDataHandler.truckPositionFeature);
            truckInformationMarkerVectorSource.addFeature(truckDataHandler.truckInformationMarkerFeature);
        }

        this.truckPositionLayer.setSource(truckPositionMarkerVectorSource);
        this.truckInformationMarkerLayer.setSource(truckInformationMarkerVectorSource);
    };

    return LayerData;
})();

//TruckDataHandler
var TruckDataHandler = (function () {

    function TruckDataHandler(truckJson) {
        this.id = truckJson.id;
        this.infotext = truckJson.txt;
        this.truckRegistrationNumber = truckJson.reg;

        this.truckTrackFeatures = [];
        this.truckTrackMarkerFeatures = [];
        this.truckInformationMarkerFeature;
        this.truckPositionFeature;
        this.currentPosition;

        this.storeJsonData(truckJson);
    };


    TruckDataHandler.prototype.storeJsonData = function (truckJson) {

        var coordinates = ol.proj.transform([truckJson.lon, truckJson.lat], 'EPSG:4326', 'EPSG:3857');

        var lastCoordinates;
        var ph = 0;
        while (ph < truckJson.hist.length) {

            var pos = truckJson.hist[ph++];
            var coordinates = ol.proj.transform([pos.lon, pos.lat], 'EPSG:4326', 'EPSG:3857');
            if (lastCoordinates != null) {
                var dx = coordinates[0] - lastCoordinates[0];
                var dy = coordinates[1] - lastCoordinates[1];
                var rotation = Math.atan2(dy, dx);

                console.log(truckJson);
                this.truckTrackMarkerFeatures.push(this.createTruckTrackMarker(coordinates, rotation, pos.ts));

                this.truckTrackFeatures.push(this.createTruckTrackLine(lastCoordinates, coordinates));
            }
            lastCoordinates = coordinates;
        }
        this.truckPositionFeature = this.createTruckPositionMarker(coordinates, rotation);
        this.truckInformationMarkerFeature = this.createTruckInformationMarker(coordinates);
        this.currentPosition = lastCoordinates;
    };

   TruckDataHandler.prototype.updateTruckPosition = function (layerData, lat, lon) {
      var coordinates = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
      var rotation = 0;
      if (this.currentPosition != null) {
         var dx = coordinates[0] - this.currentPosition[0];
         var dy = coordinates[1] - this.currentPosition[1];
         rotation = Math.atan2(dy, dx);
      }

      layerData.truckPositionLayer.getSource().removeFeature(this.truckPositionFeature);
      this.truckPositionFeature = this.createTruckPositionMarker(coordinates, rotation);
      layerData.truckPositionLayer.getSource().addFeature(this.truckPositionFeature);

      layerData.truckInformationMarkerLayer.getSource().removeFeature(this.truckInformationMarkerFeature);
      this.truckInformationMarkerFeature = this.createTruckInformationMarker(coordinates);
      layerData.truckInformationMarkerLayer.getSource().addFeature(this.truckInformationMarkerFeature);

      var newTrackFeature = this.createTruckTrackLine(this.currentPosition, coordinates);
      layerData.truckTrackLayer.getSource().addFeature(newTrackFeature);
      this.truckTrackFeatures.push(this.createTruckTrackLine(this.currentPosition, coordinates));
      this.currentPosition = coordinates;
   };

 
    TruckDataHandler.prototype.createTruckPositionMarker = function (coordinates, rotation) {
        var inst = this;
        var markerFeature = new ol.Feature({
            geometry: new ol.geom.Point([coordinates[0], coordinates[1]]),
            type: 'po',
            id: inst.id,
            text: inst.infotext
        });
        var imageFile;
        if (Math.abs(rotation) < (Math.PI / 2))
            imageFile = './Images/TruckR.png';
        else {
            imageFile = './Images/TruckL.png';
            rotation = rotation - Math.PI;
        }
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [16, 16],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                rotateWithView: false,
                rotation: -rotation,
                src: imageFile
            }))
        });
        markerFeature.setStyle(iconStyle);
        return markerFeature;
    };

    TruckDataHandler.prototype.createTruckInformationMarker = function (coordinates) {
        var markerFeature = new ol.Feature({
            geometry: new ol.geom.Point([coordinates[0], coordinates[1]]),
            type: 'ti',
        });
        var imagePath = './Images/numplate.png'; //replace with no-plate
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0, 30],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                rotateWithView: false,
                src: imagePath
            }))
        });

        markerFeature.setStyle(iconStyle);
        return markerFeature;
    };


    TruckDataHandler.prototype.createTruckTrackMarker = function (coordinates, rotation, timestamp, registrationNumber) {
        var markerFeature = new ol.Feature({
            geometry: new ol.geom.Point([coordinates[0], coordinates[1]]),
            type: 'ts',
            timestamp: timestamp,
            registrationNumber: registrationNumber
        });
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [8, 8],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                rotateWithView: false,
                rotation: -rotation,
                src: './Images/arrow2.png'
            }))
        });

        markerFeature.setStyle(iconStyle);
        return markerFeature;
    };
    TruckDataHandler.prototype.createTruckTrackLine = function (prevCoordinates, coordinates) {
        return new ol.Feature({
            geometry: new ol.geom.LineString([[prevCoordinates[0], prevCoordinates[1]], [coordinates[0], coordinates[1]]]),
            type: 'tr',
            registrationNumber: this.truckRegistrationNumber
        });
    }


    return TruckDataHandler;

})();