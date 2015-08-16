
// module names
module public {

}

module SamplePublic1 {
    // module variables
    var public;
}

module SamplePublic2 {
    // module function
    function public() {}
}

class SamplePublic3 {
    // class variables
    private public;
}

// class properties
class SamplePublic4 {
    private var;
    set public(value) {}
    get public() { return this.var;}
}


class SamplePublic5 {
    public() {}       // class methods
}

// interface declarations
interface SamplePublic6 {
    public: any;
}

// function parameters
function methodPublic(public) {}

// local variables
var public;
