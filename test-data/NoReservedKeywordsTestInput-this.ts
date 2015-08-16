
class SampleThis3 {
    // class variables
    private this;
}

// class properties
class SampleThis4 {
    private var;
    set this(value) {}
    get this() { return this.var;}
}


class SampleThis5 {
    this() {}       // class methods
}

// interface declarations
interface SampleThis6 {
    this: any;
}
