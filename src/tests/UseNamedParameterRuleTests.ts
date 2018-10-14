import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('useNamedParameterRule', () : void => {
    const ruleName : string = 'use-named-parameter';

    it('should ban referencing arguments by numeric index', () : void => {
        const inputScript : string = `
function add() {
    return arguments[0] + arguments[1];
}`;

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Use a named parameter instead: 'arguments[0]'",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "use-named-parameter",
                "startPosition": { "character": 12, "line": 3 }
            },
            {
                "failure": "Use a named parameter instead: 'arguments[1]'",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "use-named-parameter",
                "startPosition": { "character": 27, "line": 3 }
            }
        ]);
    });

    it('should allow referencing arguments by variable index', () : void => {
        const inputScript : string = `
function add() {
    return arguments[whatever()] + arguments[n];
}`;
        TestHelper.assertViolations(ruleName, inputScript, [ ]);
    });
});
