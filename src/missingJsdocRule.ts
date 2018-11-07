import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'missing-jsdoc',
        type: 'maintainability',
        description: 'All files must have a top level JSDoc comment.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false,'
    };

    public static FAILURE_STRING: string = 'File missing JSDoc comment at the top-level.';

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: missing-jsdoc rule is deprecated. Replace your usage with the TSLint missing-jsdoc rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new MissingJSDocWalker(sourceFile, this.getOptions()));
    }
}

class MissingJSDocWalker extends Lint.RuleWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (!/^\/\*\*\s*$/gm.test(node.getFullText())) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
        // do not continue walking
    }
}
