import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Unnecessary method override. A method that only calls super can be removed: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-override',
        type: 'maintainability',
        description: 'Do not write a method that only calls super() on the parent method with the same arguments.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
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

class NoUnnecessaryOverrideRuleWalker extends Lint.RuleWalker {
    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (node.body !== undefined) {
            const statement = this.getSingleStatement(node.body);
            if (statement !== undefined) {
                if (this.isSuperCall(node, statement) && this.isMatchingArgumentList(node, statement)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + this.getMethodName(node));
                }
            }
        }
        super.visitMethodDeclaration(node);
    }

    private getSingleStatement(block: ts.Block): ts.Statement | undefined {
        if (block.statements.length === 1) {
            return block.statements[0];
        }
        return undefined;
    }

    private isMatchingArgumentList(node: ts.MethodDeclaration, statement: ts.Statement): boolean {
        const call = this.getCallExpressionFromStatement(statement);
        if (call === undefined) {
            return false;
        }
        if (call.arguments.length === 0 && node.parameters.length === 0) {
            return true; // 0 args means they match
        }
        if (call.arguments.length !== node.parameters.length) {
            return false; // different param list lengths means they do not match
        }

        const allParameters: ReadonlyArray<ts.ParameterDeclaration> = node.parameters;
        /* tslint:disable:increment-decrement */
        for (let i = 0; i < allParameters.length; i++) {
            /* tslint:enable:increment-decrement */
            const parameter: ts.ParameterDeclaration = allParameters[i];
            const argument: ts.Expression = call.arguments[i];
            if (argument.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }
            if (parameter.name.kind !== ts.SyntaxKind.Identifier) {
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
        const call = this.getCallExpressionFromStatement(statement);
        if (call === undefined) {
            return false;
        }
        if (call.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            return false;
        }

        const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>call.expression;
        if (propAccess.expression.kind !== ts.SyntaxKind.SuperKeyword) {
            return false;
        }

        const declaredMethodName = this.getMethodName(node);
        const methodName: string = propAccess.name.text;
        return methodName === declaredMethodName;
    }

    private getCallExpressionFromStatement(statement: ts.Statement): ts.CallExpression | undefined {
        let expression: ts.Expression | undefined;
        if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
            expression = (<ts.ExpressionStatement>statement).expression;
        } else if (statement.kind === ts.SyntaxKind.ReturnStatement) {
            expression = (<ts.ReturnStatement>statement).expression;
            if (expression === undefined) {
                return undefined; // return statements do not have to have an expression
            }
        } else {
            return undefined;
        }

        if (expression.kind !== ts.SyntaxKind.CallExpression) {
            return undefined;
        }

        const call: ts.CallExpression = <ts.CallExpression>expression;
        if (call.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            return undefined;
        }
        return call;
    }

    private getMethodName(node: ts.MethodDeclaration): string {
        const nameNode: ts.Identifier | ts.LiteralExpression | ts.ComputedPropertyName = node.name;
        if (nameNode.kind === ts.SyntaxKind.Identifier) {
            return (<ts.Identifier>nameNode).text;
        }
        return '<unknown>';
    }
}
