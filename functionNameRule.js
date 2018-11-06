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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var AstUtils_1 = require("./utils/AstUtils");
var TypeGuard_1 = require("./utils/TypeGuard");
var METHOD_REGEX = 'method-regex';
var PRIVATE_METHOD_REGEX = 'private-method-regex';
var PROTECTED_METHOD_REGEX = 'protected-method-regex';
var STATIC_METHOD_REGEX = 'static-method-regex';
var FUNCTION_REGEX = 'function-regex';
var VALIDATE_PRIVATE_STATICS_AS_PRIVATE = 'validate-private-statics-as-private';
var VALIDATE_PRIVATE_STATICS_AS_STATIC = 'validate-private-statics-as-static';
var VALIDATE_PRIVATE_STATICS_AS_EITHER = 'validate-private-statics-as-either';
var VALID_ARGS = [VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER];
function parseOptions(ruleArguments) {
    if (ruleArguments.length === 0) {
        return {
            validateStatics: VALIDATE_PRIVATE_STATICS_AS_PRIVATE
        };
    }
    var staticsValidateOption = ruleArguments[1];
    if (VALID_ARGS.indexOf(staticsValidateOption) > -1) {
        return {
            validateStatics: staticsValidateOption
        };
    }
    else {
        return {
            validateStatics: VALIDATE_PRIVATE_STATICS_AS_PRIVATE
        };
    }
}
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new FunctionNameRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'function-name',
        type: 'maintainability',
        description: 'Applies a naming convention to function names and method names',
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Function styles should be consistent throughout the code.\n            Users may want functions with multiple descriptors to be validated a certain way.\n            An optional argument specifies validation for private static methods:\n            * `", "` enforces validation as private.\n            * `", "` enforces validation as static.\n            * `", "` enforces validation as either.\n            "], ["\n            Function styles should be consistent throughout the code.\n            Users may want functions with multiple descriptors to be validated a certain way.\n            An optional argument specifies validation for private static methods:\n            * \\`", "\\` enforces validation as private.\n            * \\`", "\\` enforces validation as static.\n            * \\`", "\\` enforces validation as either.\n            "])), VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER),
        options: {
            type: 'array',
            items: [
                {
                    type: 'string',
                    enum: [VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER]
                }
            ],
            minLength: 0,
            maxLength: 2
        },
        optionExamples: [
            [true, VALIDATE_PRIVATE_STATICS_AS_EITHER],
            [true, VALIDATE_PRIVATE_STATICS_AS_PRIVATE],
            [true, VALIDATE_PRIVATE_STATICS_AS_STATIC],
            [true]
        ],
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var FunctionNameRuleWalker = (function (_super) {
    __extends(FunctionNameRuleWalker, _super);
    function FunctionNameRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.methodRegex = /^[a-z][\w\d]+$/;
        _this.privateMethodRegex = _this.methodRegex;
        _this.protectedMethodRegex = _this.privateMethodRegex;
        _this.staticMethodRegex = /^[A-Z_\d]+$/;
        _this.functionRegex = /^[a-z][\w\d]+$/;
        _this.args = parseOptions(options.ruleArguments);
        _this.getOptions().forEach(function (opt) {
            if (TypeGuard_1.isObject(opt)) {
                _this.methodRegex = _this.getOptionOrDefault(opt, METHOD_REGEX, _this.methodRegex);
                _this.privateMethodRegex = _this.getOptionOrDefault(opt, PRIVATE_METHOD_REGEX, _this.privateMethodRegex);
                _this.protectedMethodRegex = _this.getOptionOrDefault(opt, PROTECTED_METHOD_REGEX, _this.protectedMethodRegex);
                _this.staticMethodRegex = _this.getOptionOrDefault(opt, STATIC_METHOD_REGEX, _this.staticMethodRegex);
                _this.functionRegex = _this.getOptionOrDefault(opt, FUNCTION_REGEX, _this.functionRegex);
            }
        });
        return _this;
    }
    FunctionNameRuleWalker.prototype.visitMethodDeclaration = function (node) {
        var name = node.name.getText();
        if (AstUtils_1.AstUtils.hasComputedName(node)) {
        }
        else if (AstUtils_1.AstUtils.isPrivate(node)) {
            if (!this.privateMethodRegex.test(name) && this.args.validateStatics === VALIDATE_PRIVATE_STATICS_AS_PRIVATE) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(), "Private method name does not match " + this.privateMethodRegex + ": " + name);
            }
        }
        else if (AstUtils_1.AstUtils.isProtected(node)) {
            if (!this.protectedMethodRegex.test(name) && this.args.validateStatics === VALIDATE_PRIVATE_STATICS_AS_PRIVATE) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(), "Protected method name does not match " + this.protectedMethodRegex + ": " + name);
            }
        }
        else if (AstUtils_1.AstUtils.isStatic(node)) {
            if (!this.staticMethodRegex.test(name)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(), "Static method name does not match " + this.staticMethodRegex + ": " + name);
            }
        }
        else if (!this.methodRegex.test(name)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth(), "Method name does not match " + this.methodRegex + ": " + name);
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    FunctionNameRuleWalker.prototype.visitFunctionDeclaration = function (node) {
        if (node.name !== undefined) {
            var name_1 = node.name.text;
            if (!this.functionRegex.test(name_1)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(), "Function name does not match " + this.functionRegex + ": " + name_1);
            }
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    FunctionNameRuleWalker.prototype.getOptionOrDefault = function (option, key, defaultValue) {
        try {
            var value = option[key];
            if (value !== undefined && (typeof value === 'string' || value instanceof RegExp)) {
                return new RegExp(value);
            }
        }
        catch (e) {
            console.error('Could not read ' + key + ' within function-name configuration');
        }
        return defaultValue;
    };
    return FunctionNameRuleWalker;
}(Lint.RuleWalker));
var templateObject_1;
//# sourceMappingURL=functionNameRule.js.map