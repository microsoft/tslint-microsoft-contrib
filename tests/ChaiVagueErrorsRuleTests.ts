/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('chaiVagueErrorsRule', () : void => {

    var ruleName : string = 'chai-vague-errors';

    it('should pass on xxx', () : void => {
        var script : string = `
            expect(something).to.equal(true, 'message');;
            expect(something).to.be.equal(false, 'message');;
            expect(something).to.not.equal(null, 'message');;
            expect(something).to.not.be.equal(undefined, 'message');;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on ok', () : void => {
        var script : string = `
            expect(something).to.ok;
            chai.expect(something).to.ok;
            expect(something).to.be.ok;
            chai.expect(something).to.not.be.ok;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 5 }
            }
        ]);
    });

    it('should fail on true', () : void => {
        var script : string = `
            expect(something).to.true;
            chai.expect(something).to.be.true;
            expect(something).to.not.be.true;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on false', () : void => {
        var script : string = `
            expect(something).to.false;
            expect(something).to.be.false;
            expect(something).to.not.be.false;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on null', () : void => {
        var script : string = `
            expect(something).to.null;
            expect(something).to.be.null;
            expect(something).to.not.be.null;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on undefined', () : void => {
        var script : string = `
            expect(something).to.undefined;
            expect(something).to.be.undefined;
            expect(something).to.not.be.undefined;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on equal', () : void => {
        var script : string = `
            expect(something).to.equal(true);
            expect(something).to.equals(true);
            expect(something).to.be.equal(true);
            expect(something).to.be.equals(true);
            expect(something).to.not.be.equal(false);
            expect(something).to.deep.equal(null);
            expect(something).to.not.equal(undefined);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 5 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 6 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 7 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 8 }
            }
        ]);
    });

    it('should fail on eql', () : void => {
        var script : string = `
            expect(something).to.eql(true);
            expect(something).to.be.eql(true);
            chai.expect(something).to.not.be.eql(false);
            expect(something).to.deep.eql(null);
            chai.expect(something).to.not.eql(undefined);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 5 }
            },
            {
                "failure": "Found chai call with vague failure message. Please add an explicit failure message",
                "name": "file.ts",
                "ruleName": "chai-vague-errors",
                "startPosition": { "character": 13, "line": 6 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
