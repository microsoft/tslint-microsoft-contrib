import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

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

    it('should pass on null and undefined comparisons', () : void => {
        const script : string = `
            const a1 = password === null;
            const a2 = password == null;
            const a3 = password !== null;
            const a4 = password != null;
            const a5 = null === secret;
            const a6 = null == secret;
            const a7 = null !== secret;
            const a8 = null != secret;

            const b1 = apiKey === undefined;
            const b2 = apiKey == undefined;
            const b3 = apiKey !== undefined;
            const b4 = apiKey != undefined;
            const b5 = undefined === token;
            const b6 = undefined == token;
            const b7 = undefined !== token;
            const b8 = undefined != token;
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: secret == api",
                "name": Utils.absolutePath("file.ts"),
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: apiKey === token",
                "name": Utils.absolutePath("file.ts"),
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: auth != hash",
                "name": Utils.absolutePath("file.ts"),
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 2 }
            },
            {
                "failure": "Possible timing attack detected. Direct comparison found: hash !== secret",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "possible-timing-attack",
                "startPosition": { "character": 23, "line": 3 }
            }
        ]);
    });

});
