/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noUnexternalizedStringsRule', () : void => {
    var ruleName : string = 'no-unexternalized-strings';

    it('should pass on single quote', () : void => {
        var script : string = `
            let str = 'Hello Worlds';
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on template expression', () : void => {
        var script : string = 'let str = `Hello ${var} Worlds`;';
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on localize', () : void => {
        var script : string = `
            let str = localize("key", "Hello Worlds");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on nls.localize', () : void => {
        var script : string = `
            import nls = require('nls');
            let str = nls.localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on import', () : void => {
        var script : string = `
            import { localize } from "nls";
            let str = localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on import equals', () : void => {
        var script : string = `
            import nls = require("nls");
            let str = nls.localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [ ]);
    });

    it('should pass on ignores', () : void => {
        var script : string = `
            var nls = require("nls");
            let str = nls.localize("Key", "Hello World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName,
            [{ signatures: ['localize', 'nls.localize'], messageIndex: 1, ignores: ['require'] }],
            script, [ ]
        );
    });

    it('should fail on my.localize', () : void => {
        var script : string = `
            let str = my.localize('key', "Needs localization");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": "file.ts",
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 42,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on function call inside localize', () : void => {
        var script : string = `
            let str = localize('key', foo("Needs localization"));
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": "file.ts",
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 43,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on method call inside localize', () : void => {
        var script : string = `
            let str = localize('key', this.foo("Needs localization"));
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": "file.ts",
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 48,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on variable declaration', () : void => {
        var script : string = `
            let str = "Needs localization";
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Needs localization\"",
                "name": "file.ts",
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 23,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on function declaration', () : void => {
        var script : string = `
            let str: string = undefined;
            function foo() {
                str = "Hello World";
            }
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Unexternalized string found: \"Hello World\"",
                "name": "file.ts",
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 23,
                    "line": 4
                }
            }
        ]);
    });

    it('should fail on binary expression', () : void => {
        var script : string = `
            localize('key', "Hello " + "World");
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [{ signatures: ['localize', 'nls.localize'], messageIndex: 1 }], script, [
            {
                "failure": "Message argument to 'localize' must be a string literal.",
                "name": "file.ts",
                "ruleName": "no-unexternalized-strings",
                "startPosition": {
                    "character": 29,
                    "line": 2
                }
            }
        ]);
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */