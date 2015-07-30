var typedStringVariable = 'string variable';

// these should all create violations
setTimeout(typedStringVariable);            // example 2
this.setTimeout(typedStringVariable);       // example 7
window.setTimeout(typedStringVariable);     // example 12
