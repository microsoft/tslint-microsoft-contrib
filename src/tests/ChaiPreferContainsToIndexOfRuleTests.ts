import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('chaiPreferContainsToIndexOfRule', () : void => {

    const ruleName : string = 'chai-prefer-contains-to-index-of';

    it('should pass on contain', () : void => {
        const script : string = `
            expect(targetUrl).to.contain(twitterAuthUrl, '...');
            chai.expect(targetUrl).to.contain(twitterAuthUrl, '...');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on not contain', () : void => {
        const script : string = `
            expect(targetUrl).to.not.contain(twitterAuthUrl,'...');
            chai.expect(targetUrl).to.not.contain(twitterAuthUrl,'...');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on indexOf equal to -1 in call expression', () : void => {
        const script : string = `
            expect(targetUrl.indexOf(twitterAuthUrl)).to.equal(-1,'...');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with indexOf that can be converted to .contain assertion: ",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "chai-prefer-contains-to-index-of",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on indexOf equal to -1 in property expression', () : void => {
        const script : string = `
            chai.expect(targetUrl.indexOf(twitterAuthUrl)).to.equal(-1,'...');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with indexOf that can be converted to .contain assertion: ",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "chai-prefer-contains-to-index-of",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on indexOf not equal to -1 in call expression', () : void => {
        const script : string = `
            expect(targetUrl.indexOf(twitterAuthUrl)).not.to.equal(-1,'...');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with indexOf that can be converted to .contain assertion: ",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "chai-prefer-contains-to-index-of",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on indexOf not equal to -1 in property expression', () : void => {
        const script : string = `
            chai.expect(targetUrl.indexOf(twitterAuthUrl)).not.to.equal(-1,'...');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found chai call with indexOf that can be converted to .contain assertion: ",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "chai-prefer-contains-to-index-of",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
