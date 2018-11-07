// module names
namespace let {

}

namespace SampleLet1 {
    // module variables
    var let;
}

namespace SampleLet2 {
    // module function
    function let() {}
}

class SampleLet3 {
    // class variables
    private let;
}

// class properties
class SampleLet4 {
    private var;
    set let(value) {}
    get let() {
        return this.var;
    }
}

class SampleLet5 {
    let() {} // class methods
}

// interface declarations
interface SampleLet6 {
    let: any;
}

// function parameters
function methodLet(let) {}

// local variables
var let;
