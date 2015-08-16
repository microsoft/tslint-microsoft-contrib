
// module names
module protected {

}

module SampleProtected1 {
    // module variables
    var protected;
}

module SampleProtected2 {
    // module function
    function protected() {}
}

class SampleProtected3 {
    // class variables
    private protected;
}

// class properties
class SampleProtected4 {
    private var;
    set protected(value) {}
    get protected() { return this.var;}
}


class SampleProtected5 {
    protected() {}       // class methods
}

// interface declarations
interface SampleProtected6 {
    protected: any;
}

// function parameters
function methodProtected(protected) {}

// local variables
var protected;
