
class SampleDefault3 {
    // class variables
    private default;
}

// class properties
class SampleDefault4 {
    private var;
    set default(value) {}
    get default() { return this.var;}
}


class SampleDefault5 {
    default() {}       // class methods
}

// interface declarations
interface SampleDefault6 {
    default: any;
}
