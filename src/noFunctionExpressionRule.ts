import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-function-expression rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Use arrow function instead of function expression';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFunctionExpressionRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoFunctionExpressionRuleWalker extends ErrorTolerantWalker {
    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        let walker = new SingleFunctionWalker(this.getSourceFile(), this.getOptions());
        node.getChildren().forEach((node: ts.Node) => {
            walker.walk(node);
        });
        // function expression that access 'this' is allowed
        if (!walker.isAccessingThis) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitFunctionExpression(node);
    }
}

class SingleFunctionWalker extends ErrorTolerantWalker {
    public isAccessingThis: boolean = false;
    protected visitNode(node: ts.Node): void {
        if (node.getText() === 'this') {
            this.isAccessingThis = true;
        }
        super.visitNode(node);
    }
    /* tslint:disable:no-empty */
    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        // do not visit inner blocks
    }
    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        // do not visit inner blocks
    }
    /* tslint:enable:no-empty */
}