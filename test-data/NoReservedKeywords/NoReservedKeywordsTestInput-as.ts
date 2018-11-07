// module names
namespace WrapperAs {
    namespace as {
        // class names
        class as {}
    }
}

namespace SampleAs1 {
    // module variables
    var as;
}

namespace SampleAs2 {
    // module function
    function as() {}
}

class SampleAs3 {
    // class variables
    private as;
}

// class properties
class SampleAs4 {
    private var;
    set as(value) {}
    get as() {
        return this.var;
    }
}

class SampleAs5 {
    as() {} // class methods
    method(as) {} // method parameters
    private func = as => {}; // arrow function parameters
}

// interface declarations
interface SampleAs6 {
    as: any;
}

// function parameters
function methodAs(as) {}

// local variables
var as;
