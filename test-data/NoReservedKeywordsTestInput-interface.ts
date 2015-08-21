
// module names
module interface {

}

module SampleInterface1 {
    // module variables
    var interface;
}

module SampleInterface2 {
    // module function
    function interface() {}
}

class SampleInterface3 {
    // class variables
    private interface;
}

// class properties
class SampleInterface4 {
    private var;
    set interface(value) {}
    get interface() { return this.var;}
}


class SampleInterface5 {
    interface() {}       // class methods
}

// interface declarations
interface SampleInterface6 {
    interface: any;
}

// function parameters
function methodInterface(interface) {}

// local variables
var interface;
