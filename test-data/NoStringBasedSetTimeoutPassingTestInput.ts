
var functionVariable = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function

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
