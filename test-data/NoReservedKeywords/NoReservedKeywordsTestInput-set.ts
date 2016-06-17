
// module names
module WrapperSet {
    module set {

        // class names
        class set {

        }
    }
}

module SampleSet1 {
    // module variables
    var set;
}

module SampleSet2 {
    // module function
    function set() {}
}

class SampleSet3 {
    // class variables
    private set;
}

// class properties
class SampleSet4 {
    private var;
    set set(value) {}
    get set() { return this.var;}
}


class SampleSet5 {
    set() {}       // class methods
    method(set) {}  // method parameters
    private func = (set) => {}; // arrow function parameters

}

// interface declarations
interface SampleSet6 {
    set: any;
}

// function parameters
function methodSet(set) {}

// local variables
var set;
