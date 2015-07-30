var untypedCreateFunction: () => any = () => {};    // function that produces a function

// these should all create violations
setTimeout(untypedCreateFunction());        // example 4
this.setTimeout(untypedCreateFunction());   // example 9
window.setTimeout(untypedCreateFunction()); // example 14
