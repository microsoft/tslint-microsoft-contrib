 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noExecScriptRule', () : void => {
    const RULE_NAME : string = 'no-exec-script';

    it('should produce violations ', () : void => {
        const inputFile : string = 'test-data/NoExecScriptTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "forbidden execScript: execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 2,
                    "character": 1
                }
            },
            {
                "failure": "forbidden execScript: this.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 3,
                    "character": 1
                }
            },
            {
                "failure": "forbidden execScript: window.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 4,
                    "character": 1
                }
            },
            {
                "failure": "forbidden execScript: (<any>window).execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 5,
                    "character": 1
                }
            },
            {
                "failure": "forbidden execScript: execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 7,
                    "character": 9
                }
            },
            {
                "failure": "forbidden execScript: this.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 8,
                    "character": 9
                }
            },
            {
                "failure": "forbidden execScript: window.execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 9,
                    "character": 9
                }
            },
            {
                "failure": "forbidden execScript: (<any>window).execScript",
                "name": "test-data/NoExecScriptTestInput.ts",
                "ruleName": "no-exec-script",
                "startPosition": {
                    "line": 10,
                    "character": 9
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
