import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';

/**
 * Implementation of the no-constant-condition rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Found constant conditional: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstantConditionRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoConstantConditionRuleWalker extends ErrorTolerantWalker {

    private isConstant(node: ts.Node): boolean {

        if (node.kind === SyntaxKind.current().BinaryExpression) {
            const expression: ts.BinaryExpression = <ts.BinaryExpression>node;
            const kind: ts.SyntaxKind = expression.operatorToken.kind;
            if (kind >= SyntaxKind.current().FirstBinaryOperator && kind <= SyntaxKind.current().LastBinaryOperator) {
                return this.isConstant(expression.left) && this.isConstant(expression.right);
            }
        }
        if (node.kind === SyntaxKind.current().PrefixUnaryExpression || node.kind === SyntaxKind.current().PostfixUnaryExpression) {
            const expression: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression =
                <ts.PostfixUnaryExpression | ts.PrefixUnaryExpression>node;
            const kind: ts.SyntaxKind = expression.operator;
            if (kind >= SyntaxKind.current().FirstBinaryOperator && kind <= SyntaxKind.current().LastBinaryOperator) {
                return this.isConstant(expression.operand);
            }
        }
        //console.log(ts.SyntaxKind[node.kind] + ' ' + node.getText());
        return node.kind === SyntaxKind.current().FalseKeyword
            || node.kind === SyntaxKind.current().TrueKeyword
            || node.kind === SyntaxKind.current().NumericLiteral;
    }

    protected visitIfStatement(node: ts.IfStatement): void {
        if (this.isConstant(node.expression)) {
            const message: string = Rule.FAILURE_STRING + 'if (' + node.expression.getText() + ')';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        super.visitIfStatement(node);
    }


    protected visitConditionalExpression(node: ts.ConditionalExpression): void {
        if (this.isConstant(node.condition)) {
            const message: string = Rule.FAILURE_STRING + node.condition.getText() + ' ?';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        super.visitConditionalExpression(node);
    }


    protected visitWhileStatement(node: ts.WhileStatement): void {
        if (this.isConstant(node.expression)) {
            const message: string = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        super.visitWhileStatement(node);
    }


    protected visitDoStatement(node: ts.DoStatement): void {
        if (this.isConstant(node.expression)) {
            const message: string = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        super.visitDoStatement(node);
    }


    protected visitForStatement(node: ts.ForStatement): void {
        if (node.condition != null) {
            if (this.isConstant(node.condition)) {
                const message: string = Rule.FAILURE_STRING + ';' + node.condition.getText() + ';';
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
            }
        }
        super.visitForStatement(node);
    }
}
