import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'missing-jsdoc',
        type: 'maintainability',
        description: 'Deprecated - This rule can be replaced with TSLint\'s file-header. All files must have a top level JSDoc comment.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false'
    };

    public static FAILURE_STRING: string = 'File missing JSDoc comment at the top-level: ';

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: missing-jsdoc rule is deprecated. ' +
                'Replace your usage with the TSLint missing-jsdoc rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new MissingJSDocWalker(sourceFile, this.getOptions()));
    }
}

class MissingJSDocWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (!/^\/\*\*\s*$/gm.test(node.getFullText())) {
            const failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName;
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
        // do not continue walking
    }
}
