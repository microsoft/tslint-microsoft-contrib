
function invoke(functionArg1 : () => void, functionArg2 = () => {}) {
    setTimeout(functionArg1);
    setTimeout(functionArg2);
}