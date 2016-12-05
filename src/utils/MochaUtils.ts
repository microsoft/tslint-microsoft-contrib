import * as ts from 'typescript';

import {AstUtils} from './AstUtils';
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
        if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
            const expression: ts.Expression = (<ts.ExpressionStatement>statement).expression;
            if (expression.kind === ts.SyntaxKind.CallExpression) {
                const call: ts.CallExpression = <ts.CallExpression>expression;
                return isDescribe(call);
            }
        }
        return false;
    }

    /**
     * Tells you if the call is a describe or context call.
     */
    export function isDescribe(call: ts.CallExpression): boolean {
        const functionName: string = AstUtils.getFunctionName(call);
        const callText: string = call.expression.getText();
        return functionName === 'describe'
            || functionName === 'context'
            || /(describe|context)\.(only|skip|timeout)/.test(callText);
    }

    /**
     * Tells you if the call is an it(), specify(), before(), etc.
     */
    export function isLifecycleMethod(call: ts.CallExpression): boolean {
        const functionName: string = AstUtils.getFunctionName(call);
        return functionName === 'it' || functionName === 'specify'
            || functionName === 'before' || functionName === 'beforeEach' || functionName === 'beforeAll'
            || functionName === 'after' || functionName === 'afterEach' || functionName === 'afterAll';
    }
}