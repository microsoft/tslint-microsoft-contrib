
class NoDuplicateParameterNamesTestInput {

    /**
     * The following code should have no errors:
     */
    constructor() {}

    constructor(arg1) {}

    constructor(arg1, arg2) {}

    voidMethod() {}
    unaryMethod(arg1) {}
    bindaryMethod(arg1, arg2) {}

    private arrow0 = () => {};
    private arrow1 = (arg) => {};
    private arrow2 = (arg1, arg2) => {};

    private arrowFunction0 = function() {};
    private arrowFunction1 = function(arg) {};
    private arrowFunction2 = function(arg1, arg2) {};

    /**
     * The following code should have errors:
     */
    constructor(arg1, duplicateConstructorParameter, duplicateConstructorParameter) {}                  // triggers visitConstructorDeclaration
    binaryMethod2(duplicateMethodParameter, duplicateMethodParameter?) {}                               // triggers visitMethodDeclaration
    private arrowFunction3 = (duplicateArrowFunctionParameter, duplicateArrowFunctionParameter) => {};  // triggers visitArrowFunction
    private function3 = function(duplicateFunctionExpParameter, duplicateFunctionExpParameter) {};      // triggers visitFunctionExpression
}

// these declarations need to be made outside of a class
function function0() {}
function function1(arg) {}
function function2(arg1, arg2) {}
function function3(duplicateFunctionParameter, duplicateFunctionParameter) {}                           // triggers visitFunctionDeclaration

