"use strict";
var SyntaxKind_1 = require('./SyntaxKind');
var Utils_1 = require('./Utils');
var MochaUtils;
(function (MochaUtils) {
    function isMochaTest(node) {
        return Utils_1.Utils.exists(node.statements, function (statement) {
            return isStatementDescribeCall(statement);
        });
    }
    MochaUtils.isMochaTest = isMochaTest;
    function isStatementDescribeCall(statement) {
        if (statement.kind === SyntaxKind_1.SyntaxKind.current().ExpressionStatement) {
            var expression = statement.expression;
            if (expression.kind === SyntaxKind_1.SyntaxKind.current().CallExpression) {
                var call = expression;
                var expressionText = call.expression.getText();
                return expressionText === 'describe' || expressionText === 'describe.only'
                    || expressionText === 'describe.skip' || expressionText === 'describe.timeout';
            }
        }
        return false;
    }
    MochaUtils.isStatementDescribeCall = isStatementDescribeCall;
})(MochaUtils = exports.MochaUtils || (exports.MochaUtils = {}));
//# sourceMappingURL=MochaUtils.js.map