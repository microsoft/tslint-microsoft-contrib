/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('maxFuncBodyLengthRule', () : void => {

        let options;
        var script : string = `
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
        `;

    var ruleName : string = 'max-func-body-length';

    describe('when functions do not exceed general option value and syntax kind wise options are not used', () => {
        beforeEach(() => {
            options = [ true, 14 ];
        });

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
                    "failure": "Max function body length exceeded - max: 5, actual: 14",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 9,
                        "line": 4
                    }
                },
                {
                    "failure": "Max method body length exceeded - max: 5, actual: 12",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 13,
                        "line": 22
                    }
                },
                {
                    "failure": "Max arrow function body length exceeded - max: 5, actual: 8",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 36,
                        "line": 38
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
                    'arrow-body-length': 4
                }
            ];
        });

        it('should fail', () : void => {
            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    "failure": "Max function body length exceeded - max: 6, actual: 14",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 9,
                        "line": 4
                    }
                },
                {
                    "failure": "Max method body length exceeded - max: 7, actual: 12",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 13,
                        "line": 22
                    }
                },
                {
                    "failure": "Max arrow function body length exceeded - max: 4, actual: 8",
                    "name": "file.ts",
                    "ruleName": "max-func-body-length",
                    "startPosition": {
                        "character": 36,
                        "line": 38
                    }
                }
            ]);
        });
    });


});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
