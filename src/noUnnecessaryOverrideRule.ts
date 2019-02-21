import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

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
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function getSingleStatement(block: ts.Block): ts.Statement | undefined {
        if (block.statements.length === 1) {
            return block.statements[0];
        }
        return undefined;
    }

    function isMatchingArgumentList(node: ts.MethodDeclaration, statement: ts.Statement): boolean {
        const call = getCallExpressionFromStatement(statement);
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
            if (!tsutils.isIdentifier(argument)) {
                return false;
            }
            if (!tsutils.isIdentifier(parameter.name)) {
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

    function isSuperCall(node: ts.MethodDeclaration, statement: ts.Statement): boolean {
        const call = getCallExpressionFromStatement(statement);
        if (call === undefined) {
            return false;
        }
        if (!tsutils.isPropertyAccessExpression(call.expression)) {
            return false;
        }

        const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>call.expression;
        if (propAccess.expression.kind !== ts.SyntaxKind.SuperKeyword) {
            return false;
        }

        const declaredMethodName = getMethodName(node);
        const methodName: string = propAccess.name.text;
        return methodName === declaredMethodName;
    }

    function getCallExpressionFromStatement(statement: ts.Statement): ts.CallExpression | undefined {
        let expression: ts.Expression | undefined;
        if (tsutils.isExpressionStatement(statement)) {
            expression = statement.expression;
        } else if (tsutils.isReturnStatement(statement)) {
            expression = statement.expression;
            if (expression === undefined) {
                return undefined; // return statements do not have to have an expression
            }
        } else {
            return undefined;
        }

        if (!tsutils.isCallExpression(expression)) {
            return undefined;
        }

        const call: ts.CallExpression = <ts.CallExpression>expression;
        if (!tsutils.isPropertyAccessExpression(call.expression)) {
            return undefined;
        }
        return call;
    }

    function getMethodName(node: ts.MethodDeclaration): string {
        const nameNode: ts.Identifier | ts.LiteralExpression | ts.ComputedPropertyName = node.name;
        if (tsutils.isIdentifier(nameNode)) {
            return nameNode.text;
        }
        return '<unknown>';
    }

    function cb(node: ts.Node): void {
        if (tsutils.isMethodDeclaration(node)) {
            if (node.body !== undefined) {
                const statement = getSingleStatement(node.body);
                if (statement !== undefined) {
                    if (isSuperCall(node, statement) && isMatchingArgumentList(node, statement)) {
                        ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + getMethodName(node));
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
