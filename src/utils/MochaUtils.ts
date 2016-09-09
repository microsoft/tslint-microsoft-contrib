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
                return isDescribe(expressionText) || isContext(expressionText);
            }
        }
        return false;
    }

    function isDescribe(callText: string): boolean {
        return callText === 'describe' || callText === 'describe.only'
            || callText === 'describe.skip' || callText === 'describe.timeout';
    }

    /**
     * Context is an alias for describe.
     */
    function isContext(callText: string): boolean {
        return callText === 'context' || callText === 'context.only'
            || callText === 'context.skip' || callText === 'context.timeout';
    }
}