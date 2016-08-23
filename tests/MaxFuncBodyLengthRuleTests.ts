/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />


import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('maxFuncBodyLengthRule', () : void => {
        let options;
        const script : string = `
        (function () { alert('!'); })();

        function hasBodyLengthOf10 (x, y, z) {
            let result = 'a';
            for (let i = 0; i < 10; i++) {
                result += 'b';
            }

            try {
                x = 2 / 0;
            } catch (err) {
                return ['magic'];
            }

            return [ 0, 0, 1, 2, 3, 5, 8 ]
                .map(x => x * 2)
                .filter(x => x % 3 === 0);
        }

        class Magic {

            constructor (mana) {
                if (!mana || mana === 0) {
                    throw new Error('Not enough mana.');
                }

                this.spells = mana / 10;
                // very long comment on the spells calculation
                // every spell takes 10 mana you know
                // so..
            }

            sparks () {
                for (let i = 0; i < 100; i++) {
                    try {
                        throw new Error('Sparks!');
                    } catch (sprk) {
                        continue;
                    }
                }

                let x = 2 + 3 +
                    4 + 5;

                return 1;
            }
        }

        export var nuclearOption = (a) => {
            alert('kaboom');
            alert('bbblaast');
            alert('arrrgggg');
            alert('omgomgomg');
            alert('yay');
            return 2;
        };

        export var igniteFire = (a) => {
            // creating flames is a pretty
            // complex process.
            // we should
            // thoroughly
            // document
            /**
             * the flame-
             * making
             * process so that future
             * wizards know what
             * the deal is
             */
             // but playing with fire is
             // deadly
            throw new Error('Use sparks instead, they are less deadly');
        };`;

    const ruleName : string = 'max-func-body-length';

    describe('when functions do not exceed general option value and syntax kind wise options are not used', () => {
        it('should not fail', () : void => {
            TestHelper.assertViolations(ruleName, script, [ ]);
        });
    });

    describe('when general option is used and functions lengths exceed its value', () => {
        beforeEach(() => {
            options = [ true, 5 ];
        });

        it('should fail', () : void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    "failure": "Max function body length exceeded in function hasBodyLengthOf10() - max: 5, actual: 15",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 9,
                        "line": 4
                    }
                },
                {
                    "failure": "Max constructor body length exceeded in class Magic - max: 5, actual: 9",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 13,
                        "line": 23
                    }
                },
                {
                    "failure": "Max method body length exceeded in method sparks() - max: 5, actual: 13",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 13,
                        "line": 34
                    }
                },
                {
                    "failure": "Max arrow function body length exceeded - max: 5, actual: 7",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 36,
                        "line": 50
                    }
                },
                {
                    "failure": "Max arrow function body length exceeded - max: 5, actual: 16",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 33,
                        "line": 59
                    }
                }
            ]);
        });
    });

    describe('when syntax kind wise options are used and functions lengths exceed their value', () => {
        beforeEach(() => {
            options = [ true,
                {
                    'func-body-length': 6,
                    'method-body-length': 7,
                    'arrow-body-length': 4,
                    'ctor-body-length': 3
                }
            ];
        });

        it('should fail', () : void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    "failure": "Max function body length exceeded in function hasBodyLengthOf10() - max: 6, actual: 15",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 9,
                        "line": 4
                    }
                },
                {
                    "failure": "Max constructor body length exceeded in class Magic - max: 3, actual: 9",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 13,
                        "line": 23
                    }
                },
                {
                    "failure": "Max method body length exceeded in method sparks() - max: 7, actual: 13",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 13,
                        "line": 34
                    }
                },
                {
                    "failure": "Max arrow function body length exceeded - max: 4, actual: 7",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 36,
                        "line": 50
                    }
                },
                {
                    "failure": "Max arrow function body length exceeded - max: 4, actual: 16",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 33,
                        "line": 59
                    }
                }
            ]);
        });
    });

    describe('when ignoring comments option is used and function lengths exceed their value', () => {
        beforeEach(() => {
            options = [ true, 3, { 'ignore-comments': true } ];
        });

        it('should not fail due to single- or multi- line comments', () : void => {
            TestHelper.assertNoViolationWithOptions(ruleName, options, `
                function sum(a,b) {
                    /**
                     * add both a and b together
                     * this is some complex math,
                     * so it's best we abstract
                     * it away from the user
                     */
                    const sum = a + b;
                    return sum;
                }

                function sub(a,b) {
                    // similarly to sub, this is
                    // some pretty complex
                    // arithmetic.
                    // let's keep this away from
                    // the user as well.

                    return a - b;
                }
            `);
        });

        it('should fail due to lines with mixed code and comments', () : void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, `
                function sum(a,b) {
                    let sum = a; // start with a
                    sum += b; // now add b
                    return sum; // return the result
                }
            `, [
                {
                    "failure": "Max function body length exceeded in function sum() - max: 3, actual: 4",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 17,
                        "line": 2
                    }
                }
            ]);
        });
    });

    describe('when using mocha describe blocks', () => {
        beforeEach(() => {
            options = [ true,
                5, // max length is now 5
                {
                    'ignore-parameters-to-function-regex': 'describe'
                }
            ];
        });

        it('should be able to ignore describe calls', () : void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, `
            describe('something', (): void => {
                // line 2
                // line 3
                // line 4
                // line 5
            }); // line 6
            `, []);
        });

    });

    describe('when function expression passed as a parameter', () => {
        beforeEach(() => {
            options = [ true,
                5, // max length is now 5
                {
                }
            ];
        });

        it('should be able to ignore describe calls', () : void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, `
            describe('something', function name() {
                // line 2
                // line 3
                // line 4
                // line 5
                // line 6
            });
            describe('something', function () {
                // line 2
                // line 3
                // line 4
                // line 5
                // line 6
            });
            `, [{
                "failure": "Max function expression body length exceeded in function expression name() - max: 5," +
                           " actual: 6",
                "name": "file.ts",
                "ruleName": "max-func-body-length",
                "startPosition": {
                    "character": 35,
                    "line": 2
                }
            }, {
                "failure": "Max function expression body length exceeded in function expression () - max: 5, actual: 6",
                "name": "file.ts",
                "ruleName": "max-func-body-length",
                "startPosition": {
                    "character": 35,
                    "line": 9
                }
            }]);
        });
    });

});