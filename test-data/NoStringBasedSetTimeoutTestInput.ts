
var typedStringVariable = 'string variable';
var functionVariable = () => {};
var anyVariable : any = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function
var untypedCreateFunction: () => any = () => {};    // function that produces a function
var stringFunction : () => string = () => { return ''; }; // function that produces a string

// lambdas are OK
setTimeout(() => {});
this.setTimeout(() => {});
window.setTimeout(() => {});
// functions are OK
setTimeout(function () {});
this.setTimeout(function () {});
window.setTimeout(function () {});
// expressions of type function are OK
setTimeout(functionVariable);
this.setTimeout(functionVariable);
window.setTimeout(functionVariable);
var a = setTimeout(functionVariable);
var b = this.setTimeout(functionVariable);
var c = window.setTimeout(functionVariable);
setTimeout(createFunction());
this.setTimeout(createFunction());
window.setTimeout(createFunction());


// currently a false positive.
// see https://stackoverflow.com/questions/31673007/how-do-i-determine-the-compile-time-type-of-a-typescript-expression-that-is-a-fu
function invoke(functionArg : () => void) {
    setTimeout(functionArg);
}


// these should all create violations
setTimeout("var x = 'should fail'");        // example 1
setTimeout(typedStringVariable);            // example 2
setTimeout(anyVariable);                    // example 3
setTimeout(untypedCreateFunction());        // example 4
setTimeout(stringFunction());               // example 5
this.setTimeout("var x = 'should fail'");   // example 6
this.setTimeout(typedStringVariable);       // example 7
this.setTimeout(anyVariable);               // example 8
this.setTimeout(untypedCreateFunction());   // example 9
this.setTimeout(stringFunction());          // example 10
window.setTimeout("var x = 'should fail'"); // example 11
window.setTimeout(typedStringVariable);     // example 12
window.setTimeout(anyVariable);             // example 13
window.setTimeout(untypedCreateFunction()); // example 14
window.setTimeout(stringFunction());        // example 15
function invoke2(stringArg : string) {
    setTimeout(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setTimeout(anyArg);                     // example 17
}
