import * as ts from 'typescript';

import {SyntaxKind} from './SyntaxKind';
import {Utils} from './Utils';

/**
 * Common functions for Mocha AST.
 */
export module MochaUtils {

    export function isMochaTest(node: ts.SourceFile): boolean {
        return Utils.exists(node.statements, (statement: ts.Statement): boolean => {
            return isStatementDescribeCall(statement);
        });
    }

    export function isStatementDescribeCall(statement: ts.Statement): boolean {
        if (statement.kind === SyntaxKind.current().ExpressionStatement) {
            const expression: ts.Expression = (<ts.ExpressionStatement>statement).expression;
            if (expression.kind === SyntaxKind.current().CallExpression) {
                const call: ts.CallExpression = <ts.CallExpression>expression;
                const expressionText: string = call.expression.getText();
                return expressionText === 'describe' || expressionText === 'describe.only'
                    || expressionText === 'describe.skip' || expressionText === 'describe.timeout';
            }
        }
        return false;
    }
}