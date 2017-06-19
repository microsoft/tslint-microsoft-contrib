"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
var AstUtils_1 = require("./utils/AstUtils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoFunctionConstructorWithStringArgsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: 'no-function-constructor-with-string-args',
    type: 'maintainability',
    description: 'Do not use the version of the Function constructor that accepts a string argument to define the body of the function',
    options: null,
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    group: 'Security',
    commonWeaknessEnumeration: '95, 676, 242, 116'
};
Rule.FAILURE_STRING = 'forbidden: Function constructor with string arguments ';
exports.Rule = Rule;
var NoFunctionConstructorWithStringArgsWalker = (function (_super) {
    __extends(NoFunctionConstructorWithStringArgsWalker, _super);
    function NoFunctionConstructorWithStringArgsWalker(sourceFile, options) {
        return _super.call(this, sourceFile, options) || this;
    }
    NoFunctionConstructorWithStringArgsWalker.prototype.visitNewExpression = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (functionName === 'Function') {
            if (node.arguments.length > 0) {
                this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
            }
        }
        _super.prototype.visitNewExpression.call(this, node);
    };
    return NoFunctionConstructorWithStringArgsWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noFunctionConstructorWithStringArgsRule.js.map