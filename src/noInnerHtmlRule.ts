import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');
import AstUtils = require('./utils/AstUtils');

const FAILURE_INNER: string = 'Writing a string to the innerHTML property is insecure: ';
const FAILURE_OUTER: string = 'Writing a string to the outerHTML property is insecure: ';
const FAILURE_JQUERY: string = 'Using the html() function to write a string to innerHTML is insecure: ';

/**
 * Implementation of the no-inner-html rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInnerHtmlRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoInnerHtmlRuleWalker extends ErrorTolerantWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        // look for assignments to property expressions where the
        // left hand side is either innerHTML or outerHTML
        if (node.operatorToken.kind === SyntaxKind.current().EqualsToken) {
            if (node.left.kind === SyntaxKind.current().PropertyAccessExpression) {
                const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.left;
                const propName: string = propAccess.name.text;
                if (propName === 'innerHTML') {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_INNER + node.getText()));
                } else if (propName === 'outerHTML') {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_OUTER + node.getText()));
                }
            }
        }
        super.visitBinaryExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        var functionName = AstUtils.getFunctionName(node);
        if (functionName === 'html') {
            if (node.arguments.length > 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_JQUERY + node.getText()));
            }
        }
        super.visitCallExpression(node);
    }
}
