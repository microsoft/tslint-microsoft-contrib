import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('chaiVagueErrorsRule', (): void => {
    const ruleName: string = 'chai-vague-errors';

    it('should pass on xxx', (): void => {
        const script: string = `
            expect(something).to.equal(true, 'message');
            expect(something).to.be.equal(false, 'message');
            expect(something).to.not.equal(null, 'message');
            expect(something).to.not.be.equal(undefined, 'message');
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on xxx fluent', (): void => {
        const script: string = `
            expect(something, 'message').to.be.true;
            expect(something, 'message').to.be.false;
            expect(something, 'message').to.not.be.null;
            expect(something, 'message').to.not.be.undefined;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on ok', (): void => {
        const script: string = `
            expect(something).to.ok;
            chai.expect(something).to.ok;
            expect(something).to.be.ok;
            chai.expect(something).to.not.be.ok;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 5 }
            }
        ]);
    });

    it('should fail on true', (): void => {
        const script: string = `
            expect(something).to.true;
            chai.expect(something).to.be.true;
            expect(something).to.not.be.true;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            }
        ]);
    });

    it('should fail on false', (): void => {
        const script: string = `
            expect(something).to.false;
            expect(something).to.be.false;
            expect(something).to.not.be.false;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            }
        ]);
    });

    it('should fail on null', (): void => {
        const script: string = `
            expect(something).to.null;
            expect(something).to.be.null;
            expect(something).to.not.be.null;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            }
        ]);
    });

    it('should fail on undefined', (): void => {
        const script: string = `
            expect(something).to.undefined;
            expect(something).to.be.undefined;
            expect(something).to.not.be.undefined;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            }
        ]);
    });

    it('should fail on equal', (): void => {
        const script: string = `
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
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 5 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 6 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 7 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 8 }
            }
        ]);
    });

    it('should fail on eql', (): void => {
        const script: string = `
            expect(something).to.eql(true);
            expect(something).to.be.eql(true);
            chai.expect(something).to.not.be.eql(false);
            expect(something).to.deep.eql(null);
            chai.expect(something).to.not.eql(undefined);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 5 }
            },
            {
                failure: 'Found chai call with vague failure message. Please add an explicit failure message',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 6 }
            }
        ]);
    });

    it('should fail on strict equality in expectation', (): void => {
        const script: string = `
            expect(something === undefined).to.equal(true, 'something should not have been set');
            chai.expect(something === undefined).to.equal(true, 'something should not have been set');
            expect(something !== undefined).to.equal(false, 'something should not have been set');
            chai.expect(something !== undefined).to.equal(false, 'something should not have been set');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure:
                    'Found chai call with vague failure message. ' +
                    'Move the strict equality comparison from the expect call into the assertion value',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure:
                    'Found chai call with vague failure message. ' +
                    'Move the strict equality comparison from the expect call into the assertion value',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure:
                    'Found chai call with vague failure message. ' +
                    'Move the strict inequality comparison from the expect call into the assertion value. ',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 4 }
            },
            {
                failure:
                    'Found chai call with vague failure message. ' +
                    'Move the strict inequality comparison from the expect call into the assertion value. ',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 5 }
            }
        ]);
    });

    it('should fail on strictly in-equality in expectation', (): void => {
        const script: string = `
            expect(something !== undefined).to.equal(true, 'something should not have been set');
            expect(something === undefined).to.equal(false, 'something should not have been set');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure:
                    'Found chai call with vague failure message. ' +
                    'Move the strict inequality comparison from the expect call into the assertion value. ',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure:
                    'Found chai call with vague failure message. ' +
                    'Move the strict equality comparison from the expect call into the assertion value',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'chai-vague-errors',
                startPosition: { character: 13, line: 3 }
            }
        ]);
    });
});
