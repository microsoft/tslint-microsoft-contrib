import * as path from 'path';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('nonLiteralRequireRule', () : void => {

    const ruleName : string = 'non-literal-require';

    it('should pass on imports', () : void => {
        const script : string = `
            import React = require('react');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on string literals', () : void => {
        const script : string = `
            const myModule = require('myModule');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on empty array', () : void => {
        const script : string = `
            const myModule = require([]);
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on array of strings', () : void => {
        const script : string = `
            const myModule = require(['myModule']);
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on non string literal', () : void => {
        const script : string = `
            const moduleName = 'myModule';
            const myModule = require(moduleName);`;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Non-literal (insecure) parameter passed to require(): moduleName",
                "name": path.resolve("file.ts"),
                "ruleName": "non-literal-require",
                "startPosition": { "character": 38, "line": 3 }
            }
        ]);
    });

    it('should fail on non-string array element', () : void => {
        const script : string = `
            let myModule = require([
                'myModule',
                somethingElse,
                'otherModule',
                getModuleName()
            ]);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Non-literal (insecure) parameter passed to require(): somethingElse",
                "name": path.resolve("file.ts"),
                "ruleName": "non-literal-require",
                "startPosition": { "character": 17, "line": 4 }
            },
            {
                "failure": "Non-literal (insecure) parameter passed to require(): getModuleName()",
                "name": path.resolve("file.ts"),
                "ruleName": "non-literal-require",
                "startPosition": { "character": 17, "line": 6 }
            }
        ]);
    });

});
