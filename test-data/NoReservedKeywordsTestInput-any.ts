
// module names
module any {

}

module SampleAny1 {
    // module variables
    var any;
}

module SampleAny2 {
    // module function
    function any() {}
}

class SampleAny3 {
    // class variables
    private any;
}

// class properties
class SampleAny4 {
    private var;
    set any(value) {}
    get any() { return this.var;}
}


class SampleAny5 {
    any() {}       // class methods
    method(any) {}  // method parameters
    private func = (any) => {}; // arrow function parameters

}

// interface declarations
interface SampleAny6 {
    any: any;
}

// function parameters
function methodAny(any) {}

// local variables
var any;
