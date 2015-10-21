var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var SyntaxKind = require('./utils/SyntaxKind');
var Utils = require('./utils/Utils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ValidTypeofRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Invalid comparison in typeof. Did you mean ';
    Rule.VALID_TERMS = ['undefined', 'object', 'boolean', 'number', 'string', 'function'];
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var ValidTypeofRuleWalker = (function (_super) {
    __extends(ValidTypeofRuleWalker, _super);
    function ValidTypeofRuleWalker() {
        _super.apply(this, arguments);
    }
    ValidTypeofRuleWalker.prototype.visitBinaryExpression = function (node) {
        if (node.left.kind === SyntaxKind.current().TypeOfExpression && node.right.kind === SyntaxKind.current().StringLiteral) {
            this.validateTypeOf(node.right);
        }
        else if (node.right.kind === SyntaxKind.current().TypeOfExpression && node.left.kind === SyntaxKind.current().StringLiteral) {
            this.validateTypeOf(node.left);
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    ValidTypeofRuleWalker.prototype.validateTypeOf = function (node) {
        if (Rule.VALID_TERMS.indexOf(node.text) === -1) {
            var start = node.getStart();
            var width = node.getWidth();
            this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING + this.getClosestTerm(node.text) + '?'));
        }
    };
    ValidTypeofRuleWalker.prototype.getClosestTerm = function (term) {
        var _this = this;
        var closestMatch = 99999999;
        return Utils.reduce(Rule.VALID_TERMS, function (closestTerm, thisTerm) {
            var distance = _this.hammingDistance(term, thisTerm);
            if (distance < closestMatch) {
                closestMatch = distance;
                closestTerm = thisTerm;
            }
            return closestTerm;
        }, '');
    };
    ValidTypeofRuleWalker.prototype.hammingDistance = function (source, target) {
        if (source.length === 0) {
            return target.length;
        }
        if (target.length === 0) {
            return source.length;
        }
        return Math.min(this.hammingDistance(source.substr(1), target) + 1, this.hammingDistance(target.substr(1), source) + 1, this.hammingDistance(source.substr(1), target.substr(1)) + (source[0] !== target[0] ? 1 : 0)) + 1;
    };
    return ValidTypeofRuleWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=validTypeofRule.js.map