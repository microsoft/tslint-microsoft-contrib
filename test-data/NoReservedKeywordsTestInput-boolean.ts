
// module names
module WrapperBoolean {
    module boolean {
    }
}

module SampleBoolean1 {
    // module variables
    var boolean;
}

module SampleBoolean2 {
    // module function
    function boolean() {}
}

class SampleBoolean3 {
    // class variables
    private boolean;
}

// class properties
class SampleBoolean4 {
    private var;
    set boolean(value) {}
    get boolean() { return this.var;}
}


class SampleBoolean5 {
    boolean() {}       // class methods
    method(boolean) {}  // method parameters
    private func = (boolean) => {}; // arrow function parameters

}

// interface declarations
interface SampleBoolean6 {
    boolean: any;
}

// function parameters
function methodBoolean(boolean) {}

// local variables
var boolean;
