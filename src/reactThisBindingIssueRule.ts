import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {AstUtils} from './utils/AstUtils';
import {Utils} from './utils/Utils';

const FAILURE_DOUBLE_BIND: string = 'A function is having its \'this\' reference bound twice in the constructor: ';

/**
 * Implementation of the react-this-binding-issue rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactThisBindingIssueRuleWalker(sourceFile, this.getOptions()));
        }
    }
}

class ReactThisBindingIssueRuleWalker extends ErrorTolerantWalker {

    protected visitNode(node: ts.Node): void {
//        console.log(ts.SyntaxKind[node.kind] + ' ' + node.getText());
        super.visitNode(node);
    }


    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {

        if (node.body != null && node.body.statements != null) {
            const boundListeners = []
            node.body.statements.forEach((statement: ts.Statement): void => {
                if (statement.kind === SyntaxKind.current().ExpressionStatement) {
                    const expressionStatement: ts.ExpressionStatement = <ts.ExpressionStatement>statement;
                    const expression = expressionStatement.expression;
                    if (expression.kind === SyntaxKind.current().BinaryExpression) {
                        const binaryExpression: ts.BinaryExpression = <ts.BinaryExpression>expression;
                        const operator: ts.Node = binaryExpression.operatorToken;
                        if (operator.kind === SyntaxKind.current().EqualsToken) {
                            if (binaryExpression.left.kind === SyntaxKind.current().PropertyAccessExpression) {
                                const leftPropText: string = binaryExpression.left.getText();

                                if (binaryExpression.right.kind === SyntaxKind.current().CallExpression) {
                                    const callExpression = <ts.CallExpression>binaryExpression.right;
                                    if (AstUtils.getFunctionName(callExpression) === 'bind'
                                            && callExpression.arguments != null
                                            && callExpression.arguments.length === 1
                                            && callExpression.arguments[0].getText() === 'this') {

                                        const rightPropText: string = AstUtils.getFunctionTarget(callExpression);
                                        if (leftPropText === rightPropText) {

                                        }

                                        if (boundListeners.indexOf(rightPropText) === -1) {
                                            boundListeners.push(rightPropText);
                                        } else {
                                            const start = binaryExpression.getStart();
                                            const width = binaryExpression.getWidth();
                                            const msg = FAILURE_DOUBLE_BIND + binaryExpression.getText();
                                            this.addFailure(this.createFailure(start, width, msg));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        super.visitConstructorDeclaration(node);
    }
}
