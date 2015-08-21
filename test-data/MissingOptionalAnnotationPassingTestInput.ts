
class MissingOptionalAnnotationPassingTestInput {

    constructor() {}
    constructor(arg1?) {}
    constructor(arg1, arg2?) {}
    constructor(arg1, arg2?, arg3?) {}

    voidMethod() {}
    unaryMethod(arg1) {}
    bindaryMethod(arg1, arg2?) {}
    ternaryMethod(arg1, arg2?, arg3?) {}

    private arrow0 = () => {};
    private arrow1 = (arg?) => {};
    private arrow2 = (arg1, arg2?) => {};
    private arrow3 = (arg1, arg2?, arg3?) => {};

    private literalFunction0 = function() {};
    private literalFunction1 = function(arg?) {};
    private literalFunction2 = function(arg1, arg2?) {};
    private literalFunction3 = function(arg1, arg2?, arg3?) {};

}

// these declarations need to be made outside of a class
function function0() {}
function function1(arg) {}
function function2(arg1, arg2?) {}
function function3(arg1, arg2?, arg3?) {}