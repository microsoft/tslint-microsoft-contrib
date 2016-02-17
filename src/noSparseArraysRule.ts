import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');
import Utils = require('./utils/Utils');

/**
 * Implementation of the no-sparse-arrays rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Unexpected comma in middle of array';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSparseArraysRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoSparseArraysRuleWalker extends ErrorTolerantWalker {

    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().ArrayLiteralExpression) {
            if (this.isSparseArray(<ts.ArrayLiteralExpression>node)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitNode(node);
    }

    private isSparseArray(node: ts.ArrayLiteralExpression): boolean {
        return Utils.exists(node.elements, (element: ts.Node): boolean => {
            return element.kind === SyntaxKind.current().OmittedExpression;
        });
    }
}
