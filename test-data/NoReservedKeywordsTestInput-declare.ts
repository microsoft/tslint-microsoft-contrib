
// module names
module WrapperDeclare {
    module declare {

        // class names
        class declare {

        }
    }
}

module SampleDeclare1 {
    // module variables
    var declare;
}

module SampleDeclare2 {
    // module function
    function declare() {}
}

class SampleDeclare3 {
    // class variables
    private declare;
}

// class properties
class SampleDeclare4 {
    private var;
    set declare(value) {}
    get declare() { return this.var;}
}


class SampleDeclare5 {
    declare() {}       // class methods
    method(declare) {}  // method parameters
    private func = (declare) => {}; // arrow function parameters

}

// interface declarations
interface SampleDeclare6 {
    declare: any;
}

// function parameters
function methodDeclare(declare) {}

// local variables
var declare;
