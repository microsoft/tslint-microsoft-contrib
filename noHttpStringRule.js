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
var ts = require("typescript");
var Lint = require("tslint");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
var Utils_1 = require("./utils/Utils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoHttpStringWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-http-string',
        type: 'maintainability',
        description: 'Do not use strings that start with \'http:\'. URL strings should start with \'https:\'. ',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        recommendation: '[true, "http://www.example.com/?.*", "http://www.examples.com/?.*"],',
        commonWeaknessEnumeration: '319'
    };
    Rule.FAILURE_STRING = 'Forbidden http url in string: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoHttpStringWalker = (function (_super) {
    __extends(NoHttpStringWalker, _super);
    function NoHttpStringWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoHttpStringWalker.prototype.visitStringLiteral = function (node) {
        this.visitLiteralExpression(node);
        _super.prototype.visitStringLiteral.call(this, node);
    };
    NoHttpStringWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            this.visitLiteralExpression(node);
        }
        else if (node.kind === ts.SyntaxKind.TemplateHead) {
            this.visitLiteralExpression(node);
        }
        _super.prototype.visitNode.call(this, node);
    };
    NoHttpStringWalker.prototype.visitLiteralExpression = function (node) {
        var stringText = node.text;
        if (stringText.indexOf('http:') === 0) {
            if (!this.isSuppressed(stringText)) {
                var failureString = Rule.FAILURE_STRING + '\'' + stringText + '\'';
                this.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }
    };
    NoHttpStringWalker.prototype.isSuppressed = function (stringText) {
        var allExceptions = NoHttpStringWalker.getExceptions(this.getOptions());
        return Utils_1.Utils.exists(allExceptions, function (exception) {
            return new RegExp(exception).test(stringText);
        });
    };
    NoHttpStringWalker.getExceptions = function (options) {
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return options;
        }
        return null;
    };
    return NoHttpStringWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noHttpStringRule.js.map