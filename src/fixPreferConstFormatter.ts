'use strict';

import * as fs from 'fs';
import {AbstractFormatter} from 'tslint/lib/language/formatter/abstractFormatter';
import {RuleFailure} from 'tslint/lib/language/rule/rule';

/**
 * Formatter that fixes your unused imports.
 */
/* tslint:disable:export-name */
export class Formatter extends AbstractFormatter {
/* tslint:enable:export-name */

    public format(allFailures: RuleFailure[]): string {
        this.replaceVarWithConst(allFailures);
        const outputLines = allFailures.map(this.formatFailure);
        return outputLines.join('\n') + '\n';
    }

    protected readFile(fileName: string): string {
        return fs.readFileSync(fileName, { encoding: 'UTF-8' });
    }

    protected writeFile(fileName: string, fileContents: string): void {
        fs.writeFileSync(fileName, fileContents, { encoding: 'UTF-8' });
    }

    private replaceVarWithConst(allFailures: RuleFailure[]): void {
        /* tslint:disable:no-increment-decrement */
        for (let index = allFailures.length - 1; index >= 0; index--) {
        /* tslint:enable:no-increment-decrement */
            const failure = allFailures[index];
            if (failure.getRuleName() === 'prefer-const') {
                const fileName: string = failure.getFileName();
                const fileContents: string = this.readFile(fileName);
                const start: number = failure.getStartPosition().getPosition();

                let leftSide: string = fileContents.substring(0, start);
                leftSide = leftSide.replace(/let\s?$/, 'const ');
                const rightSide: string = fileContents.substring(start);
                const newContent: string = leftSide + rightSide;

                this.writeFile(fileName, newContent);
                /* tslint:disable:no-console */
                console.log('Automatically converting var/let to const. Please re-compile and re-lint: ' + fileName);
                /* tslint:enable:no-console */
            }
        }
    }

    private formatFailure(failure: RuleFailure): string {
        const fileName: string = failure.getFileName();
        const failureString: string = failure.getFailure();
        const ruleName: string = failure.getRuleName();
        const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
        const positionTuple = '[' + (lineAndCharacter.line + 1) + ', ' + (lineAndCharacter.character + 1) + ']';
        return '(' + ruleName + ') ' + fileName + positionTuple + ': ' + failureString;
    }
}