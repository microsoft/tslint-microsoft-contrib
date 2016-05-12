/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noMultipleVarDeclRule', () : void => {
    var ruleName : string = 'no-multiple-var-decl';

    it('should pass on separate var declaration and multiple var declarations within a for loop', () : void => {
        var script : string = `
            var x = 1;
            var y: number = 2;
            var z = [3, 4];
            for (var i = x, j = y; i < j; i++) {}
        `;

        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should fail on multiple var declaration', () : void => {
        var script : string = `
            var x = 1,
                y = 2;
            var x, y = 2, z;
        `;

        TestHelper.assertViolations(ruleName, script, [{
            "failure": "Do not use comma separated variable declarations: x = 1,",
            "name": "file.ts",
            "ruleName": "no-multiple-var-decl",
            "startPosition": { "character": 13, "line": 2 }
        }, {
            "failure": "Do not use comma separated variable declarations: x,",
            "name": "file.ts",
            "ruleName": "no-multiple-var-decl",
            "startPosition": { "character": 13, "line": 4 }
        }]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
