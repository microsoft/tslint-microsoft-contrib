/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noVarSelfRule', () : void => {

    const ruleName : string = 'no-var-self';

    it('should pass on other variables named self', () : void => {
        const script : string = `
            var self = other;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on variables set to this', () : void => {
        const script : string = `
            var other = this;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Assigning this reference to local variable: other = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 2 }
            }
        ]);
    });

    it('should fail on let statements set to this', () : void => {
        const script : string = `
            let other = this;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Assigning this reference to local variable: other = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": {"character": 17, "line": 2}
            }
        ]);
    });

    it('should fail on let statements set to this', () : void => {
        const script : string = `
            const other = this;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Assigning this reference to local variable: other = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": {"character": 19, "line": 2}
            }
        ]);
    });

    it('should fail on var self = this starting a chain', () : void => {
        const script : string = `
            var self = this,
                foo = bar;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Assigning this reference to local variable: self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 2 }
            }
        ]);
    });

    it('should fail on var self = this in a chain', () : void => {
        const script : string = `
            var foo = bar,
                self = this,
                baz = qux;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Assigning this reference to local variable: self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should fail on var that = this ending a chain', () : void => {
        const script : string = `
            var foo = bar,
                that = this;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Assigning this reference to local variable: that = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should respect any parameters passed', () : void => {
        const script : string = `
            let xself = this;  // this one is OK
            let selfx = this;  // this one is OK
            let xselfx = this; // this one is OK
            let self = this; // this one is not OK
        `;

        // self is specifically banned
        TestHelper.assertViolationsWithOptions(ruleName, [ '^self$' ], script, [
            {
                "failure": "Assigning this reference to local variable: self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 5 }
            }
        ]);
    });

    it('should respect any parameters passed with regex negation', () : void => {
        const script : string = `
            let xself = this;  // this one is OK
            let selfx = this;  // this one is OK
            let self = this; // this one is not OK
        `;

        // anything *but* self is specifically banned
        TestHelper.assertViolationsWithOptions(ruleName, [ '^(?!self$)' ], script, [
            {
                "failure": "Assigning this reference to local variable: xself = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 2 }
            },
            {
                "failure": "Assigning this reference to local variable: selfx = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
