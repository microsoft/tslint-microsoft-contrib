import * as ts from 'typescript';

/**
 * Utility methods for the chai.related rules.
 */
export module ChaiUtils {

    export function isExpectInvocation(node: ts.PropertyAccessExpression | ts.CallExpression): boolean {
        const callExpression = getLeftMostCallExpression(node);
        if (callExpression == null) {
            return false;
        }

        return /.*\.?expect/.test(callExpression.expression.getText());
    }

    export function getExpectInvocation(node: ts.PropertyAccessExpression | ts.CallExpression): ts.CallExpression | null {
        const callExpression = getLeftMostCallExpression(node, false);
        if (callExpression == null) {
            return null;
        }

        if (/.*\.?expect/.test(callExpression.expression.getText())) {
            return callExpression;
        } else {
            return null;
        }
    }

    export function getLeftMostCallExpression(
        node: ts.PropertyAccessExpression | ts.CallExpression,
        checkParent: boolean = false
    ): ts.CallExpression | null {
        let leftSide: ts.Node = node.expression;
        while (leftSide != null) {
            if (leftSide.kind === ts.SyntaxKind.CallExpression) {
                return <ts.CallExpression>leftSide;
            } else if (leftSide.kind === (ts.SyntaxKind.PropertyAccessExpression)) {
                leftSide = (<ts.PropertyAccessExpression>leftSide).expression;
            } else if (checkParent && leftSide.parent.kind === ts.SyntaxKind.CallExpression) {
                return <ts.CallExpression>leftSide.parent;
            } else {
                return null; // cannot walk any further left in the property expression
            }
        }
        return null;
    }

    export function getFirstExpectCallParameter(node: ts.CallExpression): ts.Node | null {
        const expectCall = ChaiUtils.getLeftMostCallExpression(node);
        if (expectCall != null && expectCall.arguments.length > 0) {
            return expectCall.arguments[0];
        }
        return null;
    }

    export function getFirstExpectationParameter(node: ts.CallExpression): ts.Node | null {
        if (node.arguments.length > 0) {
            return node.arguments[0];
        }
        return null;
    }

    export function isEqualsInvocation(propExpression: ts.PropertyAccessExpression): boolean {
        return /equal|equals|eq|eql|eqs/.test(propExpression.name.getText());
    }
}