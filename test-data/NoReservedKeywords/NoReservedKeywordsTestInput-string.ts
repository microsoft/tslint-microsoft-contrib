// module names
namespace WrapperString {
    namespace string {  }
}

namespace SampleString1 {
    // module variables
    var string;
}

namespace SampleString2 {
    // module function
    function string() {}
}

class SampleString3 {
    // class variables
    private string;
}

// class properties
class SampleString4 {
    private var;
    set string(value) {}
    get string() {
        return this.var;
    }
}

class SampleString5 {
    string() {} // class methods
    method(string) {} // method parameters
    private func = string => {}; // arrow function parameters
}

// interface declarations
interface SampleString6 {
    string: any;
}

// function parameters
function methodString(string) {}

// local variables
var string;
