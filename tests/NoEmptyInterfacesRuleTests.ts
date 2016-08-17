/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />


import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noEmptyInterfacesRule', () : void => {
    const ruleName : string = 'no-empty-interfaces';

    it('should pass on interface with 1 attribute', () : void => {
        const script : string = `
            interface MyInterface {
                attribute: string;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on interface with two different parents', () : void => {
        const script : string = `
            interface MyInterface extends First, Second {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on interface with only 1 parent (what is the point?)', () : void => {
        const script : string = `
            interface MyInterface extends First {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not declare empty interfaces: 'MyInterface'",
                "name": "file.ts",
                "ruleName": "no-empty-interfaces",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on empty interface', () : void => {
        const script : string = `
            interface MyInterface {
                // adding comments will not help you.
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not declare empty interfaces: 'MyInterface'",
                "name": "file.ts",
                "ruleName": "no-empty-interfaces",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});