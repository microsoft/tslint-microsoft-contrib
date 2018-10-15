import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noUnexternalizedStringsRule', () : void => {
    const ruleName : string = 'no-unexternalized-strings';

    it('should pass on single quote', () : void => {
        const script : string = `
            let str = 'Hello Worlds';
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on template expression', () : void => {
        // tslint:disable-next-line:no-invalid-template-strings
        const script : string = 'let str = `Hello ${var} Worlds`;';
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on localize', () : void => {
        const script : string = `
            let str = localize("key", "Hello Worlds");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on nls.localize', () : void => {
        const script : string = `
            import nls = require('nls');
            let str = nls.localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on import', () : void => {
        const script : string = `
            import { localize } from "nls";
            let str = localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on import equals', () : void => {
        const script : string = `
            import nls = require("nls");
            let str = nls.localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on ignores', () : void => {
        const script : string = `
            var nls = require("nls");
            let str = nls.localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName,
            [{ signatures: ['localize', 'nls.localize'], messageIndex: 1, ignores: ['require'] }],
            script, [ ]
        );
    });

    it('should fail on my.localize', () : void => {
        const script : string = `
            let str = my.localize('key', "Needs localization");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 42,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on function call inside localize', () : void => {
        const script : string = `
            let str = localize('key', foo("Needs localization"));
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 43,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on method call inside localize', () : void => {
        const script : string = `
            let str = localize('key', this.foo("Needs localization"));
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 48,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on variable declaration', () : void => {
        const script : string = `
            let str = "Needs localization";
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 23,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on function declaration', () : void => {
        const script : string = `
            let str: string = undefined;
            function foo() {
                str = "Hello World";
            }
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Hello World\"",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 23,
                    "line": 4
                }
            }
        ]);
    });

    it('should fail on binary expression', () : void => {
        const script : string = `
            localize('key', "Hello " + "World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Message argument to 'localize' must be a string literal.",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "ruleSeverity": "ERROR",
                "startPosition": { "character": 29, "line": 2 }
            },
            {
                "failure": "Message argument to 'localize' must be a string literal.",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-unexternalized-strings",
                "ruleSeverity": "ERROR",
                "startPosition": { "character": 40, "line": 2 }
            }
        ]);
    });
});
