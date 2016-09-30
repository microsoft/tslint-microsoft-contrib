import * as chai from 'chai';
import {TestHelper} from './TestHelper';
import {Formatter} from '../fixNoUnusedImportsFormatter';

class FixNoUnusedImportsFormatterForTesting extends Formatter {

    private input: string;
    private output: string;

    constructor(input: string) {
        super();
        this.input = input;
    }

    public getOutput(): string {
        return this.output;
    }

    protected readFile(fileName: string): string {
        return this.input;
    }

    protected writeFile(fileName: string, fileContents: string): void {
        this.output = fileContents;
    }
}

/**
 * Unit tests.
 */
describe('fixNoUnusedImportsFormatter', () : void => {

    const ruleName : string = 'no-unused-imports';

    it('should fix an unused import at start of file', () : void => {
        const input : string = `import Unused = require('Unused');
class NoUnusedImportsTestInput {
    constructor() {
    }
}`;

        const formatter = new FixNoUnusedImportsFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
`class NoUnusedImportsTestInput {
    constructor() {
    }
}`.trim());
    });

    it('should fix an unused import at last import line', () : void => {
        const input : string = `import Used = require('Used');
import Unused = require('Unused');

class NoUnusedImportsTestInput {
    constructor() {
        console.log(Used);
    }
}`;

        const formatter = new FixNoUnusedImportsFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
`import Used = require('Used');
class NoUnusedImportsTestInput {
    constructor() {
        console.log(Used);
    }
}`);
    });

});