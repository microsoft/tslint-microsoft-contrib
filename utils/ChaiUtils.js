"use strict";
var SyntaxKind_1 = require('./SyntaxKind');
var ChaiUtils;
(function (ChaiUtils) {
    function isExpectInvocation(node) {
        var callExpression = getLeftMostCallExpression(node);
        if (callExpression == null) {
            return false;
        }
        return /.*\.?expect/.test(callExpression.expression.getText());
    }
    ChaiUtils.isExpectInvocation = isExpectInvocation;
    function getLeftMostCallExpression(node) {
        var leftSide = node.expression;
        while (leftSide != null) {
            if (leftSide.kind === SyntaxKind_1.SyntaxKind.current().CallExpression) {
                return leftSide;
            }
            else if (leftSide.kind === (SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression)) {
                leftSide = leftSide.expression;
            }
            else {
                return null;
            }
        }
        return null;
    }
    ChaiUtils.getLeftMostCallExpression = getLeftMostCallExpression;
    function isEqualsInvocation(propExpression) {
        return /equal|equals|eq|eql|eqs/.test(propExpression.name.getText());
    }
    ChaiUtils.isEqualsInvocation = isEqualsInvocation;
})(ChaiUtils = exports.ChaiUtils || (exports.ChaiUtils = {}));
//# sourceMappingURL=ChaiUtils.js.map