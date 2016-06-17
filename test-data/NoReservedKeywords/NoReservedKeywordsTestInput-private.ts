
// module names
module private {

}

module SamplePrivate1 {
    // module variables
    var private;
}

module SamplePrivate2 {
    // module function
    function private() {}
}

class SamplePrivate3 {
    // class variables
    private private;
}

// class properties
class SamplePrivate4 {
    private var;
    set private(value) {}
    get private() { return this.var;}
}


class SamplePrivate5 {
    private() {}       // class methods
}

// interface declarations
interface SamplePrivate6 {
    private: any;
}

// function parameters
function methodPrivate(private) {}

// local variables
var private;
