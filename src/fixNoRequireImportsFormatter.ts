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
        super('no-require-imports', function (this: Formatter, failure: RuleFailure): void {
            const fileName: string = failure.getFileName();
            const fileContents: string = this.readFile(fileName);
            const start: number = failure.getStartPosition().getPosition();
            const end: number = failure.getEndPosition().getPosition();

            let importStartIndex = fileContents.lastIndexOf('\n', start) + 1;
            if (importStartIndex === -1) {
                importStartIndex = 0;
            }
            const importEndIndex = fileContents.indexOf('\n', end);

            const leftSide: string = fileContents.substring(0, importStartIndex);
            const middle: string = fileContents.substring(importStartIndex, importEndIndex).trim();
            const rightSide: string = fileContents.substring(importEndIndex);

            let newImport: string = middle.replace(
                /import\s+(.*)\s+=\s*require\(((.|\s)*)\);/m,
                'import {$1} from $2;');
            newImport = newImport.replace(/from \n/, 'from\n'); // clean up some spacing
            const newContent: string = leftSide + newImport + rightSide;

            this.writeFile(fileName, newContent);
            /* tslint:disable:no-console */
            console.log('Automatically converting require-style import to an ES6 import. Please re-compile and re-lint: ' + fileName);
            /* tslint:enable:no-console */
        });
    }
}