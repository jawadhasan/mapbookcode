//MapHandler
var MapHandler = (function () {

    function MapHandler() {
        this.map;
        this.truckDataHandlerArray = [];
        this.layerData = new LayerData(this.truckDataHandlerArray);
    }

    return MapHandler;

})();

//LayerData
var LayerData = (function(){

    function LayerData(truckDataHandlerArray){
        this.truckDataHandlerArray = truckDataHandlerArray;
    }

    return LayerData;

})();

//TruckDataHandler
var TruckDataHandler = (function () {

    function TruckDataHandler(truckJson) {
        this.id = truckJson.id;
        this.infotext = truckJson.txt;
        this.truckRegistrationNumber = truckJson.reg;
    };

    return TruckDataHandler;

})();