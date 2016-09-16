/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('possibleTimingAttackRule', () : void => {

    const ruleName : string = 'possible-timing-attack';

    it('should pass on non-direct comparisons', () : void => {
        const script : string = `
            const a = password < secret;
            const b = secret > api;
            const c = api <= apiKey
            const d = apiKey >= token;
            const e = token < hash;
            const f = auth > hash;
            const g = pass <= hash;
            const h = hash >= secret;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on == comparisons', () : void => {
        const script : string = `
            const a = password == secret;
            const b = secret == api;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Possible timing attack detected. Direct comparison found: password == secret",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: secret == api",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 3 }
            }
        ]);
    });

    it('should fail on === comparisons', () : void => {
        const script : string = `
            const c = api === apiKey
            const d = apiKey === token;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Possible timing attack detected. Direct comparison found: api === apiKey",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: apiKey === token",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 3 }
            }
        ]);
    });

    it('should fail on != comparisons', () : void => {
        const script : string = `
            const e = token != hash;
            const f = auth != hash;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Possible timing attack detected. Direct comparison found: token != hash",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: auth != hash",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 3 }
            }
        ]);
    });

    it('should fail on !== comparisons', () : void => {
        const script : string = `
            const g = pass !== hash;
            const h = hash !== secret;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Possible timing attack detected. Direct comparison found: pass !== hash",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: hash !== secret",
                "name": "file.ts",
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 3 }
            }
        ]);
    });

});
