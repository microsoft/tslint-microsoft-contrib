var function1 = () => {
    var functionVariable = () => {};
    var typedStringVariable = "string variable";

    // expressions of type function are OK
    setTimeout(functionVariable);

    // this should create violation
    setTimeout(typedStringVariable);
};
