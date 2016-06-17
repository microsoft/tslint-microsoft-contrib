
// module names
module static {

}

module SampleStatic1 {
    // module variables
    var static;
}

module SampleStatic2 {
    // module function
    function static() {}
}

class SampleStatic3 {
    // class variables
    private static;
}

// class properties
class SampleStatic4 {
    private var;
    set static(value) {}
    get static() { return this.var;}
}


class SampleStatic5 {
    static() {}       // class methods
}

// interface declarations
interface SampleStatic6 {
    static: any;
}

// function parameters
function methodStatic(static) {}

// local variables
var static;
