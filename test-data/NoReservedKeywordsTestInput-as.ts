
// module names
module WrapperAs {
    module as {

        // class names
        class as {

        }
    }
}

module SampleAs1 {
    // module variables
    var as;
}

module SampleAs2 {
    // module function
    function as() {}
}

class SampleAs3 {
    // class variables
    private as;
}

// class properties
class SampleAs4 {
    private var;
    set as(value) {}
    get as() { return this.var;}
}


class SampleAs5 {
    as() {}       // class methods
    method(as) {}  // method parameters
    private func = (as) => {}; // arrow function parameters

}

// interface declarations
interface SampleAs6 {
    as: any;
}

// function parameters
function methodAs(as) {}

// local variables
var as;
