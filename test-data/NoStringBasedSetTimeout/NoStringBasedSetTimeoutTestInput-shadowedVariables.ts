var globalProp1: () => void;
var globalProp2 = () => {};
var globalProp3 = function() {};

function globalFunctionShadow1() {}

namespace SetTimeoutModule {
    var moduleProp1: () => void;
    var moduleProp2 = () => {};
    var moduleProp3 = function() {};

    var globalProp1: any; // ! shadow !
    var globalFunctionShadow1 = 'not a function'; // ! shadow !

    function moduleFunction1(globalProp2: any, moduleProp1: any) {
        // ! shadow !
        setTimeout(moduleProp1, 5); // should fail
        setTimeout(moduleProp2, 5); // should pass
        setTimeout(globalFunction1, 5); // should fail
        setTimeout(globalProp2, 5); // should fail
    }

    class View {
        constructor(moduleProp1, globalProp3) {
            setTimeout(globalProp1, 5); // should fail
            setTimeout(moduleProp1, 5); // should fail
            setTimeout(globalProp2, 5); // should pass
        }

        private method2(globalProp3: any): void {
            // ! shadow !
            var f = function(moduleProp1) {
                // ! shadow !
                var x = moduleProp2 => {
                    setTimeout(globalProp1, 5); // should fail
                    setTimeout(globalProp2, 5); // should pass
                    setTimeout(globalProp3, 5); // should fail
                    setTimeout(globalFunction1, 5); // should fail

                    setTimeout(moduleProp1, 5); // should fail
                    setTimeout(moduleProp2, 5); // should fail
                    setTimeout(moduleProp3, 5); // should pass
                };
            };
        }

        public set someSetter(moduleProp1: string) {
            setTimeout(moduleProp1, 5); // should fail
        }
    }
}
