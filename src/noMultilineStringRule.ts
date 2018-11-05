import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-multiline-string',
        type: 'maintainability',
        description: 'Do not declare multiline strings',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        recommendation: 'false,',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING: string = 'Forbidden Multiline string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoMultilineStringWalker(sourceFile, this.getOptions()));
    }
}

class NoMultilineStringWalker extends Lint.RuleWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            const fullText: string = node.getFullText();
            const firstLine: string = fullText.substring(0, fullText.indexOf('\n'));
            const trimmed: string = firstLine.substring(0, 40).trim();
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + trimmed + '...');
        }
        super.visitNode(node);
    }
}
