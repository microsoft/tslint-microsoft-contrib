"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var OPTION_ALLOW_SIBLINGS = 'allow-siblings';
var FAILURE_BODY_RELATIVE = 'module is being loaded from a relative path. Please use an absolute path';
var FAILURE_BODY_SIBLINGS = 'module path starts with reference to parent directory. Please use an absolute path or sibling files/folders';
var FAILURE_BODY_INSIDE = 'module path should not contain reference to current or parent directory inside';
var illegalInsideRegex = /(\/|\\)\.\.?\1/;
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoRelativeImportsRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-relative-imports',
        type: 'maintainability',
        description: 'Do not use relative paths when importing external modules or ES6 import declarations',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [OPTION_ALLOW_SIBLINGS]
            },
            minLength: 0,
            maxLength: 1
        },
        optionsDescription: "One argument may be optionally provided: \n\n' +\n            '* `" + OPTION_ALLOW_SIBLINGS + "` allows relative imports for files in the same or nested folders.",
        typescriptOnly: false,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoRelativeImportsRuleWalker = (function (_super) {
    __extends(NoRelativeImportsRuleWalker, _super);
    function NoRelativeImportsRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allowSiblings = options.ruleArguments.indexOf(OPTION_ALLOW_SIBLINGS) > -1;
        return _this;
    }
    NoRelativeImportsRuleWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.ExternalModuleReference) {
            var moduleExpression = node.expression;
            var errorBody = this.getValidationErrorBody(moduleExpression);
            if (errorBody !== undefined) {
                this.addFailureAt(node.getStart(), node.getWidth(), "External " + errorBody + ": " + node.getText());
            }
        }
        else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            var moduleExpression = node.moduleSpecifier;
            var errorBody = this.getValidationErrorBody(moduleExpression);
            if (errorBody !== undefined) {
                this.addFailureAt(node.getStart(), node.getWidth(), "Imported " + errorBody + ": " + node.getText());
            }
        }
        _super.prototype.visitNode.call(this, node);
    };
    NoRelativeImportsRuleWalker.prototype.getValidationErrorBody = function (expression) {
        if (expression.kind === ts.SyntaxKind.StringLiteral) {
            var moduleName = expression;
            var path = moduleName.text;
            if (!this.allowSiblings && path[0] === '.') {
                return FAILURE_BODY_RELATIVE;
            }
            if (this.allowSiblings && path.indexOf('..') === 0) {
                return FAILURE_BODY_SIBLINGS;
            }
            if (illegalInsideRegex.test(path)) {
                return FAILURE_BODY_INSIDE;
            }
        }
        return undefined;
    };
    return NoRelativeImportsRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noRelativeImportsRule.js.map