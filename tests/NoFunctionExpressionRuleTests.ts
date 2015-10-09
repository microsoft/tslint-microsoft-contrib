/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noFunctionExpressionRule', () : void => {

    var ruleName : string = 'no-function-expression';

    it('should pass on arrow function', () : void => {
        var script : string = `
            var x = (): void => {
	        }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on function with this', (): void => {
        var script: string = `
            var x = function() {
                this.accessBoundProperty;
	        }
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });


   it('should fail on function expression', () : void => {
        var script : string = `
	        var x = function() {
                var y = function() {
                    this.accessProperty;
                }
	        }
        `;

        TestHelper.assertViolations(ruleName, script, [ {
            "failure": "Use arrow function instead of function expression",
            "name": "file.ts",
            "ruleName": "no-function-expression",
            "startPosition": {
                "character": 18,
                "line": 2
            }
	    }]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
