 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noExecScriptRule', () : void => {

    var RULE_NAME : string = 'no-exec-script';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoExecScriptTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 10,
                    "line": 1,
                    "position": 12
                },
                "failure": "forbidden execScript: execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 0,
                    "line": 1,
                    "position": 2
                }
            },
            {
                "endPosition": {
                    "character": 15,
                    "line": 2,
                    "position": 54
                },
                "failure": "forbidden execScript: this.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 0,
                    "line": 2,
                    "position": 39
                }
            },
            {
                "endPosition": {
                    "character": 17,
                    "line": 3,
                    "position": 98
                },
                "failure": "forbidden execScript: window.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 0,
                    "line": 3,
                    "position": 81
                }
            },
            {
                "endPosition": {
                    "character": 24,
                    "line": 4,
                    "position": 149
                },
                "failure": "forbidden execScript: (<any>window).execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 0,
                    "line": 4,
                    "position": 125
                }
            },
            {
                "endPosition": {
                    "character": 18,
                    "line": 6,
                    "position": 196
                },
                "failure": "forbidden execScript: execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 8,
                    "line": 6,
                    "position": 186
                }
            },
            {
                "endPosition": {
                    "character": 23,
                    "line": 7,
                    "position": 246
                },
                "failure": "forbidden execScript: this.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 8,
                    "line": 7,
                    "position": 231
                }
            },
            {
                "endPosition": {
                    "character": 25,
                    "line": 8,
                    "position": 298
                },
                "failure": "forbidden execScript: window.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 8,
                    "line": 8,
                    "position": 281
                }
            },
            {
                "endPosition": {
                    "character": 32,
                    "line": 9,
                    "position": 357
                },
                "failure": "forbidden execScript: (<any>window).execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "character": 8,
                    "line": 9,
                    "position": 333
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
