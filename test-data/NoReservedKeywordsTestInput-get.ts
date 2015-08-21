
// module names
module WrapperGet {
    module get {

        // class names
        class get {

        }
    }
}

module SampleGet1 {
    // module variables
    var get;
}

module SampleGet2 {
    // module function
    function get() {}
}

class SampleGet3 {
    // class variables
    private get;
}

// class properties
class SampleGet4 {
    private var;
    set get(value) {}
    get get() { return this.var;}
}


class SampleGet5 {
    get() {}       // class methods
    method(get) {}  // method parameters
    private func = (get) => {}; // arrow function parameters

}

// interface declarations
interface SampleGet6 {
    get: any;
}

// function parameters
function methodGet(get) {}

// local variables
var get;
