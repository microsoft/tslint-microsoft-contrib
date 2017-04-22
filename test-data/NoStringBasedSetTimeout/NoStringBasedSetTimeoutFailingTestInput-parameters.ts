
// these should all create violations
function invoke2(stringArg : string) {
    setTimeout(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setTimeout(anyArg);                     // example 17
}