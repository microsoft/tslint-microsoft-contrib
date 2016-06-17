var anyVariable : any = () => {};

// these should all create violations
setTimeout(anyVariable);                    // example 3
this.setTimeout(anyVariable);               // example 8
window.setTimeout(anyVariable);             // example 13
