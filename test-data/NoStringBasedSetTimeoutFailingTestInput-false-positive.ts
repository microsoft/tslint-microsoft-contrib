
// currently a false positive.
// see https://stackoverflow.com/questions/31673007/how-do-i-determine-the-compile-time-type-of-a-typescript-expression-that-is-a-fu
function invoke(functionArg : () => void) {
    setTimeout(functionArg);
}

