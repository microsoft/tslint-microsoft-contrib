import * as ts from 'typescript';

/**
 * Utility methods for the chai.related rules.
 */
export namespace ChaiUtils {
    export function isExpectInvocation(node: ts.PropertyAccessExpression | ts.CallExpression): boolean {
        const callExpression = getLeftMostCallExpression(node);
        if (callExpression === undefined) {
            return false;
        }

        return /.*\.?expect/.test(callExpression.expression.getText());
    }

    export function getExpectInvocation(node: ts.PropertyAccessExpression | ts.CallExpression): ts.CallExpression | undefined {
        const callExpression = getLeftMostCallExpression(node, false);
        if (callExpression === undefined) {
            return undefined;
        }

        if (/.*\.?expect/.test(callExpression.expression.getText())) {
            return callExpression;
        }

        return undefined;
    }

    export function getLeftMostCallExpression(
        node: ts.PropertyAccessExpression | ts.CallExpression,
        checkParent: boolean = false
    ): ts.CallExpression | undefined {
        let leftSide: ts.Node = node.expression;
        while (leftSide !== undefined) {
            if (leftSide.kind === ts.SyntaxKind.CallExpression) {
                return <ts.CallExpression>leftSide;
            }

            if (leftSide.kind === ts.SyntaxKind.PropertyAccessExpression) {
                leftSide = (<ts.PropertyAccessExpression>leftSide).expression;
            } else if (checkParent && leftSide.parent.kind === ts.SyntaxKind.CallExpression) {
                return <ts.CallExpression>leftSide.parent;
            }

            return undefined; // cannot walk any further left in the property expression
        }
        return undefined;
    }

    export function getFirstExpectCallParameter(node: ts.CallExpression): ts.Node | undefined {
        const expectCall = ChaiUtils.getLeftMostCallExpression(node);
        if (expectCall !== undefined && expectCall.arguments.length > 0) {
            return expectCall.arguments[0];
        }
        return undefined;
    }

    export function getFirstExpectationParameter(node: ts.CallExpression): ts.Node | undefined {
        if (node.arguments.length > 0) {
            return node.arguments[0];
        }
        return undefined;
    }

    export function isEqualsInvocation(propExpression: ts.PropertyAccessExpression): boolean {
        return /equal|equals|eq|eql|eqs/.test(propExpression.name.getText());
    }
}
