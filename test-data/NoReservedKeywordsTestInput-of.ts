
// module names
module WrapperOf {
    module of {

        // class names
        class of {

        }
    }
}

module SampleOf1 {
    // module variables
    var of;
}

module SampleOf2 {
    // module function
    function of() {}
}

class SampleOf3 {
    // class variables
    private of;
}

// class properties
class SampleOf4 {
    private var;
    set of(value) {}
    get of() { return this.var;}
}


class SampleOf5 {
    of() {}       // class methods
    method(of) {}  // method parameters
    private func = (of) => {}; // arrow function parameters

}

// interface declarations
interface SampleOf6 {
    of: any;
}

// function parameters
function methodOf(of) {}

// local variables
var of;
