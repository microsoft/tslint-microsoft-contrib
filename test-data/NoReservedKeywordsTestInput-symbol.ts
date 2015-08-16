
// module names
module WrapperSymbol {
    module symbol {
    }
}

module SampleSymbol1 {
    // module variables
    var symbol;
}

module SampleSymbol2 {
    // module function
    function symbol() {}
}

class SampleSymbol3 {
    // class variables
    private symbol;
}

// class properties
class SampleSymbol4 {
    private var;
    set symbol(value) {}
    get symbol() { return this.var;}
}


class SampleSymbol5 {
    symbol() {}       // class methods
    method(symbol) {}  // method parameters
    private func = (symbol) => {}; // arrow function parameters

}

// interface declarations
interface SampleSymbol6 {
    symbol: any;
}

// function parameters
function methodSymbol(symbol) {}

// local variables
var symbol;
