
class MissingOptionalAnnotationPassingTestInput {

    constructor(optionalArg1?, requiredArg2) {}
    constructor(requiredArg1, optionalArg2?, requiredArg3) {}

    bindaryMethod(optionalArg1?, requiredArg2) {}
    ternaryMethod(requiredArg1, optionalArg2?, requiredArg3) {}

    private arrow2 = (optionalArg1?, requiredArg2) => {};
    private arrow3 = (requiredArg1, optionalArg2?, requiredArg3) => {};

    private literalFunction2 = function(optionalArg1?, requiredArg2) {};
    private literalFunction3 = function(requiredArg1, optionalArg2?, requiredArg3) {};

}

// these declarations need to be made outside of a class
function function2(optionalArg1?, requiredArg2) {}
function function3(requiredArg1, optionalArg2?, requiredArg3) {}