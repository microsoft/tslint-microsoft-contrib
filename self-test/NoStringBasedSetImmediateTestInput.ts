
var typedStringVariable = 'string variable';
var functionVariable = () => {};
var anyVariable : any = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function
var untypedCreateFunction: () => any = () => {};    // function that produces a function
var stringFunction : () => string = () => { return ''; }; // function that produces a string

// lambdas are OK
setImmediate(() => {});
this.setImmediate(() => {});
window.setImmediate(() => {});
// functions are OK
setImmediate(function () {});
this.setImmediate(function () {});
window.setImmediate(function () {});
// expressions of type function are OK
setImmediate(functionVariable);
this.setImmediate(functionVariable);
window.setImmediate(functionVariable);
var a = setImmediate(functionVariable);
var b = this.setImmediate(functionVariable);
var c = window.setImmediate(functionVariable);
setImmediate(createFunction());
this.setImmediate(createFunction());
window.setImmediate(createFunction());


// currently a false positive.
// see https://stackoverflow.com/questions/31673007/how-do-i-determine-the-compile-time-type-of-a-typescript-expression-that-is-a-fu
function invoke(functionArg : () => void) {
    setImmediate(functionArg);
}


// these should all create violations
setImmediate("var x = 'should fail'");        // example 1
setImmediate(typedStringVariable);            // example 2
setImmediate(anyVariable);                    // example 3
setImmediate(untypedCreateFunction());        // example 4
setImmediate(stringFunction());               // example 5
this.setImmediate("var x = 'should fail'");   // example 6
this.setImmediate(typedStringVariable);       // example 7
this.setImmediate(anyVariable);               // example 8
this.setImmediate(untypedCreateFunction());   // example 9
this.setImmediate(stringFunction());          // example 10
window.setImmediate("var x = 'should fail'"); // example 11
window.setImmediate(typedStringVariable);     // example 12
window.setImmediate(anyVariable);             // example 13
window.setImmediate(untypedCreateFunction()); // example 14
window.setImmediate(stringFunction());        // example 15
function invoke2(stringArg : string) {
    setImmediate(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setImmediate(anyArg);                     // example 17
}
