/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./TestHelper');

describe('useNamedParameterRule', () : void => {

    var ruleName : string = 'use-named-parameter';

    it('should ban referencing arguments by numeric index', () : void => {
        var inputScript : string = `
function add() {
    return arguments[0] + arguments[1];
}`;

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Use a named parameter instead: 'arguments[0]'",
                "name": "file.ts",
                "ruleName": "use-named-parameter",
                "startPosition": { "character": 12, "line": 3 }
            },
            {
                "failure": "Use a named parameter instead: 'arguments[1]'",
                "name": "file.ts",
                "ruleName": "use-named-parameter",
                "startPosition": { "character": 27, "line": 3 }
            }
        ]);
    });

    it('should allow referencing arguments by variable index', () : void => {
        var inputScript : string = `
function add() {
    return arguments[whatever()] + arguments[n];
}`;
        TestHelper.assertViolations(ruleName, inputScript, [ ]);
    });


});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
