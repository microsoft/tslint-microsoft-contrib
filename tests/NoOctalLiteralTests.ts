 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/* tslint:disable:no-octal-literal */
describe('noOctalLiteralRule', () : void => {

    var RULE_NAME : string = 'no-octal-literal';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoOctalLiteralTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 37,
                    "line": 9,
                    "position": 219
                },
                "failure": "Octal literals should not be used: \\251",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 33,
                    "line": 9,
                    "position": 215
                }
            },
            {
                "endPosition": {
                    "character": 21,
                    "line": 11,
                    "position": 251
                },
                "failure": "Octal literals should not be used: \\254",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 17,
                    "line": 11,
                    "position": 247
                }
            },
            {
                "endPosition": {
                    "character": 0,
                    "line": 13,
                    "position": 292
                },
                "failure": "Octal literals should not be used: \\23",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 29,
                    "line": 12,
                    "position": 289
                }
            },
            {
                "endPosition": {
                    "character": 30,
                    "line": 13,
                    "position": 322
                },
                "failure": "Octal literals should not be used: \\7",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 28,
                    "line": 13,
                    "position": 320
                }
            },
            {
                "endPosition": {
                    "character": 20,
                    "line": 14,
                    "position": 354
                },
                "failure": "Octal literals should not be used: \\025",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 16,
                    "line": 14,
                    "position": 350
                }
            },
            {
                "endPosition": {
                    "character": 19,
                    "line": 15,
                    "position": 384
                },
                "failure": "Octal literals should not be used: \\0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 17,
                    "line": 15,
                    "position": 382
                }
            },
            {
                "endPosition": {
                    "character": 20,
                    "line": 16,
                    "position": 415
                },
                "failure": "Octal literals should not be used: \\-0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 17,
                    "line": 16,
                    "position": 412
                }
            },
            {
                "endPosition": {
                    "character": 21,
                    "line": 17,
                    "position": 448
                },
                "failure": "Octal literals should not be used: \\-035",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 16,
                    "line": 17,
                    "position": 443
                }
            },
            {
                "endPosition": {
                    "character": 24,
                    "line": 18,
                    "position": 481
                },
                "failure": "Octal literals should not be used: \\-235",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 19,
                    "line": 18,
                    "position": 476
                }
            },
            {
                "endPosition": {
                    "character": 27,
                    "line": 20,
                    "position": 548
                },
                "failure": "Octal literals should not be used: \\351",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 23,
                    "line": 20,
                    "position": 544
                }
            },
            {
                "endPosition": {
                    "character": 21,
                    "line": 23,
                    "position": 580
                },
                "failure": "Octal literals should not be used: \\354",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 17,
                    "line": 23,
                    "position": 576
                }
            },
            {
                "endPosition": {
                    "character": 0,
                    "line": 25,
                    "position": 621
                },
                "failure": "Octal literals should not be used: \\33",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 29,
                    "line": 24,
                    "position": 618
                }
            },
            {
                "endPosition": {
                    "character": 30,
                    "line": 25,
                    "position": 651
                },
                "failure": "Octal literals should not be used: \\6",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 28,
                    "line": 25,
                    "position": 649
                }
            },
            {
                "endPosition": {
                    "character": 20,
                    "line": 26,
                    "position": 683
                },
                "failure": "Octal literals should not be used: \\125",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 16,
                    "line": 26,
                    "position": 679
                }
            },
            {
                "endPosition": {
                    "character": 19,
                    "line": 27,
                    "position": 713
                },
                "failure": "Octal literals should not be used: \\0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 17,
                    "line": 27,
                    "position": 711
                }
            },
            {
                "endPosition": {
                    "character": 20,
                    "line": 28,
                    "position": 744
                },
                "failure": "Octal literals should not be used: \\-0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 17,
                    "line": 28,
                    "position": 741
                }
            },
            {
                "endPosition": {
                    "character": 21,
                    "line": 29,
                    "position": 777
                },
                "failure": "Octal literals should not be used: \\-035",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 16,
                    "line": 29,
                    "position": 772
                }
            },
            {
                "endPosition": {
                    "character": 24,
                    "line": 30,
                    "position": 810
                },
                "failure": "Octal literals should not be used: \\-235",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": {
                    "character": 19,
                    "line": 30,
                    "position": 805
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
 /* tslint:enable:no-octal-literal */
