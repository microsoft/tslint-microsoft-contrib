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
var OPTION_ALLOW_FOR_LOOPS = 'allow-for-loops';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoIncrementDecrementWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-increment-decrement',
        type: 'maintainability',
        description: 'Avoid use of increment and decrement operators particularly as part of complicated expressions',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [OPTION_ALLOW_FOR_LOOPS]
            },
            minLength: 0,
            maxLength: 1
        },
        optionsDescription: "One argument may be optionally provided: \n\n' +\n        '* `" + OPTION_ALLOW_FOR_LOOPS + "` allows increments and decrement operators to be used in for loop headers.",
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoIncrementDecrementWalker = (function (_super) {
    __extends(NoIncrementDecrementWalker, _super);
    function NoIncrementDecrementWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allowForLoops = options.ruleArguments.indexOf(OPTION_ALLOW_FOR_LOOPS) > -1;
        return _this;
    }
    NoIncrementDecrementWalker.prototype.visitForStatement = function (node) {
        if (this.allowForLoops) {
            _super.prototype.visitNode.call(this, node.statement);
            if (node.initializer) {
                _super.prototype.visitNode.call(this, node.initializer);
            }
            if (node.condition) {
                _super.prototype.visitNode.call(this, node.condition);
            }
        }
        else {
            _super.prototype.visitForStatement.call(this, node);
        }
    };
    NoIncrementDecrementWalker.prototype.visitPostfixUnaryExpression = function (node) {
        this.validateUnaryExpression(node);
        _super.prototype.visitPostfixUnaryExpression.call(this, node);
    };
    NoIncrementDecrementWalker.prototype.visitPrefixUnaryExpression = function (node) {
        this.validateUnaryExpression(node);
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
    };
    NoIncrementDecrementWalker.prototype.validateUnaryExpression = function (node) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden ++ operator');
        }
        else if (node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden -- operator');
        }
    };
    return NoIncrementDecrementWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noIncrementDecrementRule.js.map