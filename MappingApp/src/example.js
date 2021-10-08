  //calculator
  const calculator = (function () {
    function add(a, b) {
        return a + b;
    }

    function multiply(a, b) {
        return a * b;
    }
    return {
        add: add,
        multiply: multiply
    }
})();


//Constuctor Pattern
function Truck( model, year, miles ) {

    this.model = model;
    this.year = year;
    this.miles = miles;
  
    this.toString = function () {
      return this.model + " has done " + this.miles + " miles";
    };
  }

  