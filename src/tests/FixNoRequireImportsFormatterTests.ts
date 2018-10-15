import * as chai from 'chai';
import {TestHelper} from './TestHelper';
import {Formatter} from '../fixNoRequireImportsFormatter';

class FormatterForTesting extends Formatter {

    private input: string;
    private output!: string;

    constructor(input: string) {
        super();
        this.input = input;
    }

    public getOutput(): string {
        return this.output;
    }

    protected readFile(): string {
        return this.input;
    }

    // tslint:disable-next-line:variable-name
    protected writeFile(_fileName: string, fileContents: string): void {
        this.output = fileContents;
    }
}

describe('fixNoRequireImportsFormatter', () : void => {

    const ruleName : string = 'no-require-imports';

    it('should fix imports in middle of list', () : void => {
        const input : string = `
import {BaseFormatter} from './utils/BaseFormatter';
import TestHelper = require('./TestHelper');
`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `
import {BaseFormatter} from './utils/BaseFormatter';
import {TestHelper} from './TestHelper';
`.trim());
    });

    it('should fix imports at start of list', () : void => {
        const input : string = `import TestHelper = require('./TestHelper');
`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `import {TestHelper} from './TestHelper';
`.trim());
    });

    it('should fix imports at end of list', () : void => {
        const input : string = `import TestHelper = require('./TestHelper');

console.log(TestHelper);`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `import {TestHelper} from './TestHelper';

console.log(TestHelper);`.trim());
    });

    it('should fix multiline import', () : void => {
        const input : string = `
import TestHelper = require(
    './TestHelper'
);
`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `
import {TestHelper} from
    './TestHelper'
;
`.trim());
    });
});