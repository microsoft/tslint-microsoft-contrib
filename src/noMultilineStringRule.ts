import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-multiline-string rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-multiline-string',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Do not declare multiline strings',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        recommendation: 'true, // multiline-strings often introduce unnecessary whitespace into the string literals',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING: string = 'Forbidden Multiline string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoMultilineStringWalker(sourceFile, this.getOptions()));
    }
}

class NoMultilineStringWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            const fullText : string = node.getFullText();
            const firstLine : string = fullText.substring(0, fullText.indexOf('\n'));
            const trimmed : string = firstLine.substring(0, 40).trim();
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + trimmed + '...');
        }
        super.visitNode(node);
    }
}
