
// module names
module WrapperModule {
    module module {

        // class names
        class module {

        }
    }
}

module SampleModule1 {
    // module variables
    var module;
}

module SampleModule2 {
    // module function
    function module() {}
}

class SampleModule3 {
    // class variables
    private module;
}

// class properties
class SampleModule4 {
    private var;
    set module(value) {}
    get module() { return this.var;}
}


class SampleModule5 {
    module() {}       // class methods
    method(module) {}  // method parameters
    private func = (module) => {}; // arrow function parameters

}

// interface declarations
interface SampleModule6 {
    module: any;
}

// function parameters
function methodModule(module) {}
