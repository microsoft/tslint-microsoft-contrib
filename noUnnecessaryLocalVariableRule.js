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
var Lint = require("tslint");
var tsutils = require("tsutils");
var FAILURE_STRING = 'Unnecessary local variable: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UnnecessaryLocalVariableRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-unnecessary-local-variable',
        type: 'maintainability',
        description: 'Do not declare a variable only to return it from the function on the next line.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '563, 710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var UnnecessaryLocalVariableRuleWalker = (function (_super) {
    __extends(UnnecessaryLocalVariableRuleWalker, _super);
    function UnnecessaryLocalVariableRuleWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.variableUsages = tsutils.collectVariableUsage(_this.getSourceFile());
        return _this;
    }
    UnnecessaryLocalVariableRuleWalker.prototype.visitBlock = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitBlock.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitSourceFile = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitSourceFile.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitCaseClause = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitCaseClause.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitDefaultClause = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitDefaultClause.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitModuleDeclaration = function (node) {
        if (node.body !== undefined && tsutils.isModuleBlock(node.body)) {
            this.validateStatementArray(node.body.statements);
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.validateStatementArray = function (statements) {
        if (statements === undefined || statements.length < 2) {
            return;
        }
        var lastStatement = statements[statements.length - 1];
        var nextToLastStatement = statements[statements.length - 2];
        var returnedVariableName = this.tryToGetReturnedVariableName(lastStatement);
        var declaredVariableIdentifier = this.tryToGetDeclaredVariable(nextToLastStatement);
        if (declaredVariableIdentifier === undefined) {
            return;
        }
        var declaredVariableName = declaredVariableIdentifier.text;
        if (returnedVariableName !== undefined &&
            declaredVariableName !== undefined &&
            returnedVariableName === declaredVariableName &&
            this.variableIsOnlyUsedOnce(declaredVariableIdentifier)) {
            this.addFailureAt(nextToLastStatement.getStart(), nextToLastStatement.getWidth(), FAILURE_STRING + returnedVariableName);
        }
    };
    UnnecessaryLocalVariableRuleWalker.prototype.tryToGetDeclaredVariable = function (statement) {
        if (statement !== undefined && tsutils.isVariableStatement(statement)) {
            if (statement.declarationList.declarations.length === 1) {
                var declaration = statement.declarationList.declarations[0];
                if (declaration.name !== undefined && tsutils.isIdentifier(declaration.name)) {
                    return declaration.name;
                }
            }
        }
        return undefined;
    };
    UnnecessaryLocalVariableRuleWalker.prototype.tryToGetReturnedVariableName = function (statement) {
        if (statement !== undefined && tsutils.isReturnStatement(statement)) {
            if (statement.expression !== undefined && tsutils.isIdentifier(statement.expression)) {
                return statement.expression.text;
            }
        }
        return undefined;
    };
    UnnecessaryLocalVariableRuleWalker.prototype.variableIsOnlyUsedOnce = function (declaredVariableIdentifier) {
        var usage = this.variableUsages.get(declaredVariableIdentifier);
        return usage !== undefined && usage.uses.length === 1;
    };
    return UnnecessaryLocalVariableRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noUnnecessaryLocalVariableRule.js.map