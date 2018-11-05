// module names
namespace package {

}

namespace SamplePackage1 {
    // module variables
    var package;
}

namespace SamplePackage2 {
    // module function
    function package() {}
}

class SamplePackage3 {
    // class variables
    private package;
}

// class properties
class SamplePackage4 {
    private var;
    set package(value) {}
    get package() {
        return this.var;
    }
}

class SamplePackage5 {
    package() {} // class methods
}

// interface declarations
interface SamplePackage6 {
    package: any;
}

// function parameters
function methodPackage(package) {}

// local variables
var package;
