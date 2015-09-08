
module MyModule {

    interface Underscore {
        bind(func: Function, context: any, ...arguments: any[]): () => any;
    }

    var _ : Underscore = { bind: null };

    class ErrorClass {

        private myMethod(param1: any) : void { }

        private perform() : void {
            setTimeout(_.bind(this.myMethod, 'some value'), 500);
        }
    }
}