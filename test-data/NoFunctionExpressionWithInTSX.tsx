const notGenericFunction = function() {
    return 1 + 1;
};

const genericFunction = function<T>(x: T): T {
    return x;
};
