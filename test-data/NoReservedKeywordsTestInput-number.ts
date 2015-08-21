
// module names
module WrapperNumber {
    module number {
    }
}

module SampleNumber1 {
    // module variables
    var number;
}

module SampleNumber2 {
    // module function
    function number() {}
}

class SampleNumber3 {
    // class variables
    private number;
}

// class properties
class SampleNumber4 {
    private var;
    set number(value) {}
    get number() { return this.var;}
}


class SampleNumber5 {
    number() {}       // class methods
    method(number) {}  // method parameters
    private func = (number) => {}; // arrow function parameters

}

// interface declarations
interface SampleNumber6 {
    number: any;
}

// function parameters
function methodNumber(number) {}

// local variables
var number;
