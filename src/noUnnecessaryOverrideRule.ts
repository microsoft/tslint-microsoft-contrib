import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING = 'Unnecessary method override. A method that only calls super can be removed: ';

/**
 * Implementation of the no-unnecessary-override rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-override',
        type: 'maintainability',
        description: 'Do not write a method that only calls super() on the parent method with the same arguments.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnnecessaryOverrideRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoUnnecessaryOverrideRuleWalker extends ErrorTolerantWalker {
    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (node.body != null) {
            const statement: ts.Statement = this.getSingleStatement(node.body);
            if (statement != null) {
                if (this.isSuperCall(node, statement) && this.isMatchingArgumentList(node, statement)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + this.getMethodName(node)));
                }
            }
        }
        super.visitMethodDeclaration(node);
    }

    private getSingleStatement(block: ts.Block): ts.Statement {
        if (block.statements.length === 1) {
            return block.statements[0];
        }
        return null;
    }

    private isMatchingArgumentList(node: ts.MethodDeclaration, statement: ts.Statement): boolean {
        const call: ts.CallExpression = this.getCallExpressionFromStatement(statement);
        if (call == null) {
            return false;
        }
        if (call.arguments.length === 0 && node.parameters.length === 0) {
            return true; // 0 args means they match
        }
        if (call.arguments.length !== node.parameters.length) {
            return false; // different param list lengths means they do not match
        }

        const allParameters: ts.ParameterDeclaration[] = node.parameters;
        /* tslint:disable:no-increment-decrement */
        for (let i = 0; i < allParameters.length; i++) {
        /* tslint:enable:no-increment-decrement */
            const parameter: ts.ParameterDeclaration = allParameters[i];
            const argument: ts.Expression = call.arguments[i];
            if (argument.kind !== SyntaxKind.current().Identifier) {
                return false;
            }
            if (parameter.name.kind !== SyntaxKind.current().Identifier) {
                return false;
            }
            const argumentName: string = (<ts.Identifier>argument).text;
            const parameterName: string = (<ts.Identifier>parameter.name).text;

            if (argumentName !== parameterName) {
                return false;
            }
        }
        return true;
    }

    private isSuperCall(node: ts.MethodDeclaration, statement: ts.Statement): boolean {
        const call: ts.CallExpression = this.getCallExpressionFromStatement(statement);
        if (call == null) {
            return false;
        }
        if (call.expression.kind !== SyntaxKind.current().PropertyAccessExpression) {
            return false;
        }

        const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>call.expression;
        if (propAccess.expression.kind !== SyntaxKind.current().SuperKeyword) {
            return false;
        }

        const declaredMethodName = this.getMethodName(node);
        const methodName: string = propAccess.name.text;
        return methodName === declaredMethodName;
    }

    private getCallExpressionFromStatement(statement: ts.Statement): ts.CallExpression {
        let expression: ts.Expression;
        if (statement.kind === SyntaxKind.current().ExpressionStatement) {
            expression = (<ts.ExpressionStatement>statement).expression;
        } else if (statement.kind === SyntaxKind.current().ReturnStatement) {
            expression = (<ts.ReturnStatement>statement).expression;
            if (expression == null) {
                return null; // return statements do not have to have an expression
            }
        } else {
            return null;
        }

        if (expression.kind !== SyntaxKind.current().CallExpression) {
            return null;
        }

        const call: ts.CallExpression = <ts.CallExpression>expression;
        if (call.expression.kind !== SyntaxKind.current().PropertyAccessExpression) {
            return null;
        }
        return call;
    }

    private getMethodName(node: ts.MethodDeclaration): string {
        const nameNode: ts.Identifier | ts.LiteralExpression | ts.ComputedPropertyName = node.name;
        if (nameNode.kind === SyntaxKind.current().Identifier) {
            return (<ts.Identifier>nameNode).text;
        }
        return '<unknown>';
    }
}
