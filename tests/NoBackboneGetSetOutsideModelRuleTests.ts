/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noBackboneGetSetOutsideModelRule', () : void => {
    const ruleName : string = 'no-backbone-get-set-outside-model';

    it('should pass on get and set calls on the this reference', () : void => {
        const script : string = `
            var datetime = this.get('timestamp');
            this.set('modificationdate', datetime);
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on get and set calls with wrong # parameters and wrong parameter types', () : void => {
        const script : string = `
            model.get();
            model.get(someIdentifier);
            model.get('timestamp', 'someOtherValue');

            model.set();
            model.set('modificationdate');
            model.set('modificationdate', value1, value2);
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on get and set on an object different than this', () : void => {
        const script : string = `
            var datetime = model.get('timestamp');
            model.set('modificationdate', datetime);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Backbone get() called outside of owning model: model.get('timestamp')",
                "name": "file.ts",
                "ruleName": "no-backbone-get-set-outside-model",
                "startPosition": { "character": 28, "line": 2 }
            },
            {
                "failure": "Backbone set() called outside of owning model: model.set('modificationdate', datetime)",
                "name": "file.ts",
                "ruleName": "no-backbone-get-set-outside-model",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
