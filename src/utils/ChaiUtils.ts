import * as ts from 'typescript';
import {SyntaxKind} from './SyntaxKind';

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
            if (leftSide.kind === SyntaxKind.current().CallExpression) {
                return <ts.CallExpression>leftSide;
            } else if (leftSide.kind === (SyntaxKind.current().PropertyAccessExpression)) {
                leftSide = (<ts.PropertyAccessExpression>leftSide).expression;
            } else {
                return null; // cannot walk any further left in the property expression
            }
        }
        return null;
    }

    export function isEqualsInvocation(propExpression: ts.PropertyAccessExpression): boolean {
        return /equal|equals|eq|eql|eqs/.test(propExpression.name.getText());
    }
}