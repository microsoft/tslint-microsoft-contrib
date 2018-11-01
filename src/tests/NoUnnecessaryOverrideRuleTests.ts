import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("noUnnecessaryOverrideRule", (): void => {
    const ruleName: string = "no-unnecessary-override";

    describe("should pass", (): void => {
        it("when adding a parameter", (): void => {
            const script: string = `
                class MyClass {
                    private myField;
                    myMethod1() {
                        super.myMethod1(this.myField);
                    }
                    myMethod2() {
                        return super.myMethod2(this.myField);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when negating result", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        -super.myMethod();
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when removing a parameter", (): void => {
            const script: string = `
                class MyClass {
                    myMethod1(arg1, arg2) {
                        super.myMethod1(arg1);
                    }
                    myMethod2(arg1, arg2) {
                        return super.myMethod2(arg1);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when transposing parameters", (): void => {
            const script: string = `
                class MyClass {
                    myMethod(arg1, arg2) {
                        super.myMethod(arg2, arg1);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when changing a parameter", (): void => {
            const script: string = `
                class MyClass {
                    myMethod(arg1, arg2) {
                        super.myMethod(arg1, arg2 * 2);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when adding statements before ", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        console.log('some logging...');
                        super.myMethod();
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when adding statements after", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        super.myMethod();
                        console.log('some logging...');
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it("when calling different methods", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        super.notMyMethod();
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
    });

    describe("should fail", (): void => {
        it("should fail on calling super with 0 args and no return", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        super.myMethod();
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: "Unnecessary method override. A method that only calls super can be removed: myMethod",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "no-unnecessary-override",
                    startPosition: { character: 21, line: 3 }
                }
            ]);
        });

        it("should fail on calling super with 0 args and return", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        return super.myMethod();
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: "Unnecessary method override. A method that only calls super can be removed: myMethod",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "no-unnecessary-override",
                    startPosition: { character: 21, line: 3 }
                }
            ]);
        });

        it("should fail on calling super with argument", (): void => {
            const script: string = `
                class MyClass {
                    myMethod(arg1) {
                        super.myMethod(arg1);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: "Unnecessary method override. A method that only calls super can be removed: myMethod",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "no-unnecessary-override",
                    startPosition: { character: 21, line: 3 }
                }
            ]);
        });

        it("should fail on calling super with two arguments", (): void => {
            const script: string = `
                class MyClass {
                    myMethod(arg1, arg2) {
                        super.myMethod(arg1, arg2);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: "Unnecessary method override. A method that only calls super can be removed: myMethod",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "no-unnecessary-override",
                    startPosition: { character: 21, line: 3 }
                }
            ]);
        });

        it("should fail on calling super with default arguments", (): void => {
            const script: string = `
                class MyClass {
                    myMethod(arg1 = true, arg2 = false) {
                        super.myMethod(arg1, arg2);
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: "Unnecessary method override. A method that only calls super can be removed: myMethod",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "no-unnecessary-override",
                    startPosition: { character: 21, line: 3 }
                }
            ]);
        });

        it("should fail on calling super with comments involved", (): void => {
            const script: string = `
                class MyClass {
                    myMethod() {
                        // here is a line comment
                        return super.myMethod();
                        // here is another line comment
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: "Unnecessary method override. A method that only calls super can be removed: myMethod",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "no-unnecessary-override",
                    startPosition: { character: 21, line: 3 }
                }
            ]);
        });

        it("should not fail on empty void method", (): void => {
            const script: string = `
                class BaseComponent {
                    public function1(): void { return; }
                }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
    });
});
