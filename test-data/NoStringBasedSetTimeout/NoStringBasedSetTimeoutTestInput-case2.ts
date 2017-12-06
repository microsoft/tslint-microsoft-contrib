var globalProp1: () => void;
var globalProp2 = () => {};
var globalProp3 = function () {};

function globalFunction1() {}

setTimeout(globalProp1, 5);
setTimeout(globalProp2, 5);
setTimeout(globalProp3, 5);
setTimeout(globalFunction1, 5);

module SetTimeoutModule {

    var moduleProp1: () => void;
    var moduleProp2 = () => {};
    var moduleProp3 = function () {};

    function moduleFunction1() {
        setTimeout(moduleProp1, 5);
        setTimeout(moduleProp2, 5);
        setTimeout(moduleProp3, 5);
        setTimeout(moduleFunction1, 5);
    }

    class View {

        private property1: () => void;
        private property2 = () => {};
        private property3 = function () {};

        private static property4: () => void;
        private static property5 = () => {};
        private static property6 = function () {};

        private static method1() {}

        private method2(): void {
            setTimeout(View.method1, 5);
            setTimeout(View.property4, 5);
            setTimeout(View.property5, 5);
            setTimeout(View.property6, 5);

            setTimeout(this.method2, 5);
            setTimeout(this.property1, 5);
            setTimeout(this.property2, 5);

            setTimeout(globalProp1, 5);
            setTimeout(globalProp2, 5);
            setTimeout(globalProp3, 5);
            setTimeout(globalFunction1, 5);

            setTimeout(moduleProp1, 5);
            setTimeout(moduleProp2, 5);
            setTimeout(moduleProp3, 5);
            setTimeout(moduleFunction1, 5);

            setTimeout(this.property1, 5);

            var f = function() {
                setTimeout(this.method2, 5);
                setTimeout(this.property1, 5);
                setTimeout(this.property2, 5);
                setTimeout(this.property3, 5);
            };
        }
    }
}
