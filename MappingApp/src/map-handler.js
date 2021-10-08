//MapHandler
var MapHandler = (function () {

    //constructor
    function MapHandler() {
        this.map;
        this.truckDataHandlerArray = [];
        this.layerData = new LayerData(this.truckDataHandlerArray);
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

                this.truckTrackMarkerFeatures.push(this.createTruckTrackMarker(coordinates, rotation, pos.ts));
                this.truckTrackFeatures.push(this.createTruckTrackLine(lastCoordinates, coordinates));
            }
            lastCoordinates = coordinates;
        }
        this.truckPositionFeature = this.createTruckPositionMarker(coordinates, rotation);
        this.truckInformationMarkerFeature = this.createTruckInformationMarker(coordinates, truckJson);
        this.currentPosition = lastCoordinates;
    };


    TruckDataHandler.prototype.createTruckTrackLine = function (prevCoordinates, coordinates) {
        return new ol.Feature({
            geometry: new ol.geom.LineString([[prevCoordinates[0], prevCoordinates[1]], [coordinates[0], coordinates[1]]]),
            type: 'tr',
            registrationNumber: this.truckRegistrationNumber
        });
    }

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


    return TruckDataHandler;

})();