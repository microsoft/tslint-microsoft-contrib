
// module names
module WrapperFrom {
    module from {

        // class names
        class from {

        }
    }
}

module SampleFrom1 {
    // module variables
    var from;
}

module SampleFrom2 {
    // module function
    function from() {}
}

class SampleFrom3 {
    // class variables
    private from;
}

// class properties
class SampleFrom4 {
    private var;
    set from(value) {}
    get from() { return this.var;}
}


class SampleFrom5 {
    from() {}       // class methods
    method(from) {}  // method parameters
    private func = (from) => {}; // arrow function parameters

}

// interface declarations
interface SampleFrom6 {
    from: any;
}

// function parameters
function methodFrom(from) {}

// local variables
var from;
