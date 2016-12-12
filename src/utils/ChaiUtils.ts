import * as ts from 'typescript';

/**
 * Utility methods for the chai.related rules.
 */
export module ChaiUtils {

    export function isExpectInvocation(node: ts.PropertyAccessExpression | ts.CallExpression): boolean {
        const callExpression: ts.CallExpression = getLeftMostCallExpression(node);
        if (callExpression == null) {
            return false;
        }
        return /.*\.?expect/.test(callExpression.expression.getText());
    }

    export function getLeftMostCallExpression(node: ts.PropertyAccessExpression | ts.CallExpression): ts.CallExpression {
        let leftSide: ts.Node = node.expression;
        while (leftSide != null) {
            if (leftSide.kind === ts.SyntaxKind.CallExpression) {
                return <ts.CallExpression>leftSide;
            } else if (leftSide.kind === (ts.SyntaxKind.PropertyAccessExpression)) {
                leftSide = (<ts.PropertyAccessExpression>leftSide).expression;
            } else {
                return null; // cannot walk any further left in the property expression
            }
        }
        return null;
    }

    export function getFirstExpectCallParameter(node: ts.CallExpression): ts.Node {
        const expectCall: ts.CallExpression = ChaiUtils.getLeftMostCallExpression(node);
        if (expectCall.arguments.length > 0) {
            return expectCall.arguments[0];
        }
        return null;
    }

    export function getFirstExpectationParameter(node: ts.CallExpression): ts.Node {
        if (node.arguments.length > 0) {
            return node.arguments[0];
        }
        return null;
    }

    export function isEqualsInvocation(propExpression: ts.PropertyAccessExpression): boolean {
        return /equal|equals|eq|eql|eqs/.test(propExpression.name.getText());
    }
}