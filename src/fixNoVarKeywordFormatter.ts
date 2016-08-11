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
        super('no-var-keyword', (failure: RuleFailure): void => {

            const fileName: string = failure.getFileName();
            const fileContents: string = this.readFile(fileName);
            const end: number = failure.getEndPosition().getPosition();

            let leftSide: string = fileContents.substring(0, end);
            leftSide = leftSide.replace(/var$/, 'let');
            const rightSide: string = fileContents.substring(end);
            const newContent: string = leftSide + rightSide;

            this.writeFile(fileName, newContent);
            /* tslint:disable:no-console */
            console.log('Automatically converting var to let. Please re-compile and re-lint: ' + fileName);
            /* tslint:enable:no-console */
        });
    }
}