"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var SyntaxKind = require('./utils/SyntaxKind');
var AstUtils = require('./utils/AstUtils');
var Utils = require('./utils/Utils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MaxFunctionBodyLengthRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var FUNC_BODY_LENGTH = 'func-body-length';
var ARROW_BODY_LENGTH = 'arrow-body-length';
var METHOD_BODY_LENGTH = 'method-body-length';
var IGNORE_PARAMETERS_TO_FUNCTION = 'ignore-parameters-to-function-regex';
var MaxFunctionBodyLengthRuleWalker = (function (_super) {
    __extends(MaxFunctionBodyLengthRuleWalker, _super);
    function MaxFunctionBodyLengthRuleWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.ignoreNodes = [];
        this.parseOptions();
    }
    MaxFunctionBodyLengthRuleWalker.prototype.visitCallExpression = function (node) {
        var _this = this;
        var functionName = AstUtils.getFunctionName(node);
        if (this.ignoreParametersToFunctionRegex && this.ignoreParametersToFunctionRegex.test(functionName)) {
            node.arguments.forEach(function (argument) {
                _this.ignoreNodes.push(argument);
            });
            _super.prototype.visitCallExpression.call(this, node);
            this.ignoreNodes = Utils.removeAll(this.ignoreNodes, node.arguments);
        }
        else {
            _super.prototype.visitCallExpression.call(this, node);
        }
    };
    MaxFunctionBodyLengthRuleWalker.prototype.visitArrowFunction = function (node) {
        this.validate(node);
        _super.prototype.visitArrowFunction.call(this, node);
    };
    MaxFunctionBodyLengthRuleWalker.prototype.visitMethodDeclaration = function (node) {
        this.validate(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    MaxFunctionBodyLengthRuleWalker.prototype.visitFunctionDeclaration = function (node) {
        this.validate(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    MaxFunctionBodyLengthRuleWalker.prototype.validate = function (node) {
        if (!Utils.contains(this.ignoreNodes, node)) {
            var bodyLength = this.calcBodyLength(node);
            if (this.isFunctionTooLong(node.kind, bodyLength)) {
                this.addFuncBodyTooLongFailure(node, bodyLength);
            }
        }
    };
    MaxFunctionBodyLengthRuleWalker.prototype.calcBodyLength = function (node) {
        if (node.body == null) {
            return 0;
        }
        var sourceFile = this.getSourceFile();
        var startLine = sourceFile.getLineAndCharacterOfPosition(node.body.pos).line;
        var endLine = sourceFile.getLineAndCharacterOfPosition(node.body.end).line;
        return endLine - startLine;
    };
    MaxFunctionBodyLengthRuleWalker.prototype.isFunctionTooLong = function (nodeKind, length) {
        return length > this.getMaxLength(nodeKind);
    };
    MaxFunctionBodyLengthRuleWalker.prototype.parseOptions = function () {
        var _this = this;
        this.getOptions().forEach(function (opt) {
            if (typeof (opt) === 'number') {
                _this.maxBodyLength = opt;
                return;
            }
            if (typeof (opt) === 'object') {
                _this.maxFuncBodyLength = opt[FUNC_BODY_LENGTH];
                _this.maxArrowBodyLength = opt[ARROW_BODY_LENGTH];
                _this.maxMethodBodyLength = opt[METHOD_BODY_LENGTH];
                var regex = opt[IGNORE_PARAMETERS_TO_FUNCTION];
                if (regex) {
                    _this.ignoreParametersToFunctionRegex = new RegExp(regex);
                }
            }
        });
    };
    MaxFunctionBodyLengthRuleWalker.prototype.addFuncBodyTooLongFailure = function (node, length) {
        var failure = this.createFailure(node.getStart(), node.getWidth(), this.formatFailureText(node, length));
        this.addFailure(failure);
    };
    MaxFunctionBodyLengthRuleWalker.prototype.formatFailureText = function (node, length) {
        var funcTypeText = this.getFuncTypeText(node.kind);
        var maxLength = this.getMaxLength(node.kind);
        var methodName = '';
        if (node.kind === SyntaxKind.current().MethodDeclaration || node.kind === SyntaxKind.current().FunctionDeclaration) {
            methodName = ' in method ' + node.name.text;
        }
        return "Max " + funcTypeText + " body length exceeded" + methodName + " - max: " + maxLength + ", actual: " + length;
    };
    MaxFunctionBodyLengthRuleWalker.prototype.getFuncTypeText = function (nodeKind) {
        if (nodeKind === SyntaxKind.current().FunctionDeclaration) {
            return 'function';
        }
        else if (nodeKind === SyntaxKind.current().MethodDeclaration) {
            return 'method';
        }
        else if (nodeKind === SyntaxKind.current().ArrowFunction) {
            return 'arrow function';
        }
        else {
            throw new Error("Unsupported node kind: " + nodeKind);
        }
    };
    MaxFunctionBodyLengthRuleWalker.prototype.getMaxLength = function (nodeKind) {
        var result;
        if (nodeKind === SyntaxKind.current().FunctionDeclaration) {
            result = this.maxFuncBodyLength;
        }
        else if (nodeKind === SyntaxKind.current().MethodDeclaration) {
            result = this.maxMethodBodyLength;
        }
        else if (nodeKind === SyntaxKind.current().ArrowFunction) {
            result = this.maxArrowBodyLength;
        }
        else {
            throw new Error("Unsupported node kind: " + nodeKind);
        }
        return result || this.maxBodyLength;
    };
    return MaxFunctionBodyLengthRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=maxFuncBodyLengthRule.js.map