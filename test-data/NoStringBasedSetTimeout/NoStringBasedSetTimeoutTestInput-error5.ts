
module MyModule {

    class ErrorClass {

        private myMethod(param1: any) : void { }

        public method(): void {
            [].forEach((view: ErrorClass): void => {
                window.setTimeout(view.myMethod.bind(view), 0);
            });
        }
    }
}