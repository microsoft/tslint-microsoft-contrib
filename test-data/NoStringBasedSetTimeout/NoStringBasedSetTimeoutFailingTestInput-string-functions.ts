var stringFunction : () => string = () => { return ''; }; // function that produces a string

// these should all create violations
setTimeout(stringFunction());               // example 5
this.setTimeout(stringFunction());          // example 10
window.setTimeout(stringFunction());        // example 15
