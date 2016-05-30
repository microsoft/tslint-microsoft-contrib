'use strict';

import * as fs from 'fs';
import {AbstractFormatter} from 'tslint/lib/language/formatter/abstractFormatter';
import {RuleFailure, RuleFailurePosition} from 'tslint/lib/language/rule/rule';

/**
 * Formatter that fixes your unused imports.
 */
/* tslint:disable:export-name */
export class Formatter extends AbstractFormatter {
/* tslint:enable:export-name */

    public format(allFailures: RuleFailure[]): string {
        this.removeUnusedImports(allFailures);
        const outputLines = allFailures.map(this.formatFailure);
        return outputLines.join('\n') + '\n';
    }

    protected readFile(fileName: string): string {
        return fs.readFileSync(fileName, { encoding: 'UTF-8' });
    }

    protected writeFile(fileName: string, fileContents: string): void {
        fs.writeFileSync(fileName, fileContents, { encoding: 'UTF-8' });
    }

    private removeUnusedImports(allFailures: RuleFailure[]): void {
        /* tslint:disable:no-increment-decrement */
        for (let index = allFailures.length - 1; index >= 0; index--) {
        /* tslint:enable:no-increment-decrement */
            const failure = allFailures[index];
            if (failure.getRuleName() === 'no-unused-imports') {
                const fileName: string = failure.getFileName();
                const start: RuleFailurePosition = failure.getStartPosition();
                const end: RuleFailurePosition = failure.getEndPosition();

                let fileContents: string = this.readFile(fileName);

                let startOfViolation: number = fileContents.lastIndexOf('\n', start.getPosition());
                if (startOfViolation === -1) {
                    startOfViolation = 0; // make sure to handle the first line in the file
                }
                const endOfViolation: number = fileContents.indexOf('\n', end.getPosition());

                let line: string = fileContents.substring(startOfViolation, endOfViolation);
                line = line.trim(); // trim off any new lines, handle those in regular expression
                line = line.replace(/\(/, '\\(').replace(/\)/, '\\)');
                const regex: RegExp = new RegExp('\\n*' + line + '\\n*', 'mg');

                if (startOfViolation === 0) {
                    fileContents = fileContents.replace(regex, '');
                } else {
                    fileContents = fileContents.replace(regex, '\n');
                }
                this.writeFile(fileName, fileContents);
                /* tslint:disable:no-console */
                console.log('Automatically removing unused import. Please re-compile and re-lint: ' + fileName);
                /* tslint:enable:no-console */
            }
        }
    }

    private formatFailure(failure: RuleFailure): string {
        var fileName: string = failure.getFileName();
        var failureString: string = failure.getFailure();
        var ruleName: string = failure.getRuleName();
        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
        var positionTuple = '[' + (lineAndCharacter.line + 1) + ', ' + (lineAndCharacter.character + 1) + ']';
        return '(' + ruleName + ') ' + fileName + positionTuple + ': ' + failureString;
    }
}