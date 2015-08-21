
var typedStringVariable = 'string variable';
var functionVariable = () => {};
var anyVariable : any = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function
var untypedCreateFunction: () => any = () => {};    // function that produces a function
var stringFunction : () => string = () => { return ''; }; // function that produces a string

// lambdas are OK
setInterval(() => {});
this.setInterval(() => {});
window.setInterval(() => {});
// functions are OK
setInterval(function () {});
this.setInterval(function () {});
window.setInterval(function () {});
// expressions of type function are OK
setInterval(functionVariable);
this.setInterval(functionVariable);
window.setInterval(functionVariable);
var a = setInterval(functionVariable);
var b = this.setInterval(functionVariable);
var c = window.setInterval(functionVariable);
setInterval(createFunction());
this.setInterval(createFunction());
window.setInterval(createFunction());


// currently a false positive.
// see https://stackoverflow.com/questions/31673007/how-do-i-determine-the-compile-time-type-of-a-typescript-expression-that-is-a-fu
function invoke(functionArg : () => void) {
    setInterval(functionArg);
}


// these should all create violations
setInterval("var x = 'should fail'");        // example 1
setInterval(typedStringVariable);            // example 2
setInterval(anyVariable);                    // example 3
setInterval(untypedCreateFunction());        // example 4
setInterval(stringFunction());               // example 5
this.setInterval("var x = 'should fail'");   // example 6
this.setInterval(typedStringVariable);       // example 7
this.setInterval(anyVariable);               // example 8
this.setInterval(untypedCreateFunction());   // example 9
this.setInterval(stringFunction());          // example 10
window.setInterval("var x = 'should fail'"); // example 11
window.setInterval(typedStringVariable);     // example 12
window.setInterval(anyVariable);             // example 13
window.setInterval(untypedCreateFunction()); // example 14
window.setInterval(stringFunction());        // example 15
function invoke2(stringArg : string) {
    setInterval(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setInterval(anyArg);                     // example 17
}
