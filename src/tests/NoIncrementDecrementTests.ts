import * as path from 'path';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noIncrementDecrementRule', () : void => {
    const RULE_NAME : string = 'no-increment-decrement';

    it('should produce violations ', () : void => {
        const inputFile : string = `
var x;

x++;
x--;
++x;
--x;

`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden ++ operator",
                "name": path.resolve("file.ts"),
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 4,
                    "character": 1
                }
            },
            {
                "failure": "Forbidden -- operator",
                "name": path.resolve("file.ts"),
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 5,
                    "character": 1
                }
            },
            {
                "failure": "Forbidden ++ operator",
                "name": path.resolve("file.ts"),
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 6,
                    "character": 1
                }
            },
            {
                "failure": "Forbidden -- operator",
                "name": path.resolve("file.ts"),
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 7,
                    "character": 1
                }
            }
        ]);
    });

});
