import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("maxFuncBodyLengthRule", (): void => {
    let options: [boolean, number | object, object?];
    const script: string = `
        // https://github.com/Microsoft/tslint-microsoft-contrib/issues/468#issuecomment-407456317

        // 1-line arrow function
        const plusOne: (x: number) => number = (x: number): number => x + 1;    // Line 1

        // 3-line arrow function
        const plusTwo: (x: number) => number = (x: number): number => { // Line 1
            return x + 2;                                               // Line 2
        };                                                              // Line 3

        // 5-line "declared" function
        function plusThree(x: number): number { // Line 1
            let retVal: number = x;             // Line 2
            retVal += 3;                        // Line 3
            return retVal;                      // Line 4
        }                                       // Line 5

        // 7-line "expressed" function
        const plusFour: (x: number) => number = function (x: number): number {  // Line 1
            let retVal: number = x;                                             // Line 2
            retVal += 1;                                                        // Line 3
            retVal += 1;                                                        // Line 4
            retVal += 2;                                                        // Line 5
            return retVal;                                                      // Line 6
        };                                                                      // Line 7

        class PlusPlus {
            public num: number;

            // 4-line constructor
            constructor(num: number) {  // Line 1
                this.num = num;         // Line 2
                this.num *= 1;          // Line 3
            }                           // Line 4

            // 9-line method
            public plusFive(): number {                             // Line 1
                let ret: number = this.num;                         // Line 2
                                                                    // Line 3
                for (let iter: number = 0; iter < 5; iter += 1) {   // Line 4
                    ret += 1;                                       // Line 5
                }                                                   // Line 6
                                                                    // Line 7
                return ret;                                         // Line 8
            }                                                       // Line 9
        }

        // 10-line arrow function (with counted comments amd blanks)
        const plusSix: (x: number) => number = function (x: number): number {   // Line 1
            /* KEEP */                                                          // Line 2
            /* CALM */                                                          // Line 3
            /* AND */                                                           // Line 4
            // MIND                                                             // Line 5
            // THE                                                              // Line 6
            // GAP                                                              // Line 7

            return x + 6;                                                       // Line 9
        };                                                                      // Line 10

        // 11-nameless class
        export default class extends PlusPlus {}

        console.log(plusOne(1));                    // 2
        console.log(plusTwo(2));                    // 4
        console.log(plusThree(3));                  // 6
        console.log(plusFour(4));                   // 8
        console.log(new PlusPlus(5).plusFive());    // 10
        console.log(plusSix(6));                    // 12
        `;

    const ruleName: string = "max-func-body-length";

    describe("when functions do not exceed general option value and syntax kind wise options are not used", () => {
        it("should not fail", (): void => {
            TestHelper.assertViolations(ruleName, script, []);
        });
    });

    describe("when general option is used and functions lengths exceed its value", () => {
        beforeEach(() => {
            options = [true, 0];
        });

        it("should fail", (): void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    failure: "Max arrow function body length exceeded - max: 0, actual: 1",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 48,
                        line: 5
                    }
                },
                {
                    failure: "Max arrow function body length exceeded - max: 0, actual: 3",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 48,
                        line: 8
                    }
                },
                {
                    failure: "Max function body length exceeded in function plusThree() - max: 0, actual: 5",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 9,
                        line: 13
                    }
                },
                {
                    failure: "Max function expression body length exceeded in function expression () - max: 0, actual: 7",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 49,
                        line: 20
                    }
                },
                {
                    failure: "Max constructor body length exceeded in class PlusPlus - max: 0, actual: 4",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 13,
                        line: 32
                    }
                },
                {
                    failure: "Max method body length exceeded in method plusFive() - max: 0, actual: 9",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 13,
                        line: 38
                    }
                },
                {
                    failure: "Max function expression body length exceeded in function expression () - max: 0, actual: 10",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 48,
                        line: 50
                    }
                }
            ]);
        });
    });

    describe("when syntax kind wise options are used and functions lengths exceed their value", () => {
        beforeEach(() => {
            options = [
                true,
                {
                    "arrow-body-length": 2,
                    "ctor-body-length": 3,
                    "func-body-length": 4,
                    "func-express-body-length": 7,
                    "method-body-length": 8
                }
            ];
        });

        it("should fail", (): void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    failure: "Max arrow function body length exceeded - max: 2, actual: 3",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 48,
                        line: 8
                    }
                },
                {
                    failure: "Max function body length exceeded in function plusThree() - max: 4, actual: 5",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 9,
                        line: 13
                    }
                },
                {
                    failure: "Max constructor body length exceeded in class PlusPlus - max: 3, actual: 4",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 13,
                        line: 32
                    }
                },
                {
                    failure: "Max method body length exceeded in method plusFive() - max: 8, actual: 9",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 13,
                        line: 38
                    }
                },
                {
                    failure: "Max function expression body length exceeded in function expression () - max: 7, actual: 10",
                    name: Utils.absolutePath("file.ts"),
                    ruleName: "max-func-body-length",
                    ruleSeverity: "ERROR",
                    startPosition: {
                        character: 48,
                        line: 50
                    }
                }
            ]);
        });
    });

    describe("when ignoring comments option is used and function lengths exceed their value", () => {
        beforeEach(() => {
            options = [true, 3, { "ignore-comments": true }];
        });

        it("should not fail due to single- or multi- line comments", (): void => {
            TestHelper.assertNoViolationWithOptions(
                ruleName,
                options,
                `
                function sum(a,b) {
                    /**
                     * add both a and b together
                     * this is some complex math,
                     * so it's best we abstract
                     * it away from the user
                     */
                    return a + b;
                }

                function sub(a,b) {
                    // similarly to sub, this is
                    // some pretty complex
                    // arithmetic.
                    // let's keep this away from
                    // the user as well.
                    return a - b;
                }
            `
            );
        });

        it("should fail due to lines with mixed code and comments", (): void => {
            TestHelper.assertViolationsWithOptions(
                ruleName,
                options,
                `
                function sum(a,b) {
                    let sum = a; // start with a
                    sum += b; // now add b
                    return sum; // return the result
                }
            `,
                [
                    {
                        failure: "Max function body length exceeded in function sum() - max: 3, actual: 5",
                        name: Utils.absolutePath("file.ts"),
                        ruleName: "max-func-body-length",
                        startPosition: {
                            character: 17,
                            line: 2
                        }
                    }
                ]
            );
        });
    });

    describe("when using mocha describe blocks", () => {
        beforeEach(() => {
            options = [
                true,
                5, // max length is now 5
                {
                    "ignore-parameters-to-function-regex": "^describe$"
                }
            ];
        });

        it("should be able to ignore describe calls", (): void => {
            TestHelper.assertViolationsWithOptions(
                ruleName,
                options,
                `
            describe('something', (): void => {
                // line 2
                // line 3
                // line 4
                // line 5
            }); // line 6
            describe('something', function name() {
                // line 2
                // line 3
                // line 4
                // line 5
                // line 6
            }); // line 7
            describe('something', function () {
                // line 2
                // line 3
                // line 4
                // line 5
                // line 6
            }); // line 7
            `,
                []
            );
        });

        it('should not ignore calls of functions that are not exactly named "describe"', (): void => {
            TestHelper.assertViolationsWithOptions(
                ruleName,
                options,
                `
                    describeThings('something', (): void => {
                        // line 2
                        // line 3
                        // line 4
                        // line 5
                    }); // line 6
                `,
                [
                    {
                        failure: "Max arrow function body length exceeded - max: 5, actual: 6",
                        name: Utils.absolutePath("file.ts"),
                        ruleName: "max-func-body-length",
                        ruleSeverity: "ERROR",
                        startPosition: {
                            character: 49,
                            line: 2
                        }
                    }
                ]
            );
        });
    });
});
