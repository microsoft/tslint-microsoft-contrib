import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-multiline-string rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden Multiline string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoMultilineStringWalker(sourceFile, this.getOptions()));
    }
}

class NoMultilineStringWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().NoSubstitutionTemplateLiteral) {
            const fullText : string = node.getFullText();
            const firstLine : string = fullText.substring(0, fullText.indexOf('\n'));
            const trimmed : string = firstLine.substring(0, 40);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + trimmed + '...'));
        }
        super.visitNode(node);
    }
}
