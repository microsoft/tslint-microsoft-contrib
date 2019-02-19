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
var tsutils = require("tsutils");
var AstUtils_1 = require("./utils/AstUtils");
var TypeGuard_1 = require("./utils/TypeGuard");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    };
    Rule.prototype.parseOptions = function (options) {
        var value = false;
        var ruleOptions = [];
        if (options.ruleArguments instanceof Array) {
            ruleOptions = options.ruleArguments;
        }
        if (options instanceof Array) {
            ruleOptions = options;
        }
        ruleOptions.forEach(function (opt) {
            if (TypeGuard_1.isObject(opt)) {
                value = opt['allow-type-parameters'] === true;
            }
        });
        return {
            allowTypeParameters: value
        };
    };
    Rule.metadata = {
        ruleName: 'prefer-array-literal',
        type: 'maintainability',
        description: 'Use array literal syntax when declaring or instantiating array types.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };
    Rule.GENERICS_FAILURE_STRING = 'Replace generic-typed Array with array literal: ';
    Rule.CONSTRUCTOR_FAILURE_STRING = 'Replace Array constructor with an array literal: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var allowTypeParameters = ctx.options.allowTypeParameters;
    function cb(node) {
        if (tsutils.isTypeReferenceNode(node)) {
            if (!allowTypeParameters) {
                if (node.typeName.text === 'Array') {
                    var failureString = Rule.GENERICS_FAILURE_STRING + node.getText();
                    ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
                }
            }
        }
        if (tsutils.isNewExpression(node)) {
            var functionName = AstUtils_1.AstUtils.getFunctionName(node);
            if (functionName === 'Array') {
                var failureString = Rule.CONSTRUCTOR_FAILURE_STRING + node.getText();
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }
        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}
//# sourceMappingURL=preferArrayLiteralRule.js.map