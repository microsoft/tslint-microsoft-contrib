import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

describe('noMultilineStringRule', () : void => {
    const RULE_NAME : string = 'no-multiline-string';

    it('should produce violations ', () : void => {
        const inputFile : string = `

var x = \`some
        multiline
        string\`;`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden Multiline string: `some...",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-multiline-string",
                "startPosition": {
                    "line": 3,
                    "character": 9
                }
            }
        ]);
    });

});
