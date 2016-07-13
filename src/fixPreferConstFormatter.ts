'use strict';

import {RuleFailure} from 'tslint/lib/language/rule/rule';
import {BaseFormatter} from './utils/BaseFormatter';

/**
 * Formatter that fixes your unused imports.
 */
/* tslint:disable:export-name */
export class Formatter extends BaseFormatter {
/* tslint:enable:export-name */

    constructor() {
        super('prefer-const', (failure: RuleFailure): void => {
            const fileName: string = failure.getFileName();
            const fileContents: string = this.readFile(fileName);
            const start: number = failure.getStartPosition().getPosition();

            let leftSide: string = fileContents.substring(0, start);
            leftSide = leftSide.replace(/let(\s*)$/, 'const$1');
            const rightSide: string = fileContents.substring(start);
            const newContent: string = leftSide + rightSide;

            this.writeFile(fileName, newContent);
            /* tslint:disable:no-console */
            console.log('Automatically converting var/let to const. Please re-compile and re-lint: ' + fileName);
            /* tslint:enable:no-console */
        });
    }
}
