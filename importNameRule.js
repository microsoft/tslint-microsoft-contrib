"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker_1 = require('./utils/ErrorTolerantWalker');
var SyntaxKind_1 = require('./utils/SyntaxKind');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImportNameRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ImportNameRuleWalker = (function (_super) {
    __extends(ImportNameRuleWalker, _super);
    function ImportNameRuleWalker() {
        _super.apply(this, arguments);
    }
    ImportNameRuleWalker.prototype.visitImportEqualsDeclaration = function (node) {
        var name = node.name.text;
        if (node.moduleReference.kind === SyntaxKind_1.SyntaxKind.current().ExternalModuleReference) {
            var moduleRef = node.moduleReference;
            if (moduleRef.expression.kind === SyntaxKind_1.SyntaxKind.current().StringLiteral) {
                var moduleName = moduleRef.expression.text;
                this.validateImport(node, name, moduleName);
            }
        }
        else if (node.moduleReference.kind === SyntaxKind_1.SyntaxKind.current().QualifiedName) {
            var moduleName = node.moduleReference.getText();
            moduleName = moduleName.replace(/.*\./, '');
            this.validateImport(node, name, moduleName);
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    ImportNameRuleWalker.prototype.visitImportDeclaration = function (node) {
        if (node.importClause.name != null) {
            var name_1 = node.importClause.name.text;
            if (node.moduleSpecifier.kind === SyntaxKind_1.SyntaxKind.current().StringLiteral) {
                var moduleName = node.moduleSpecifier.text;
                this.validateImport(node, name_1, moduleName);
            }
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    ImportNameRuleWalker.prototype.validateImport = function (node, importedName, moduleName) {
        moduleName = moduleName.replace(/.*\//, '');
        if (moduleName !== importedName) {
            var message = "Misnamed import. Import should be named '" + moduleName + "' but found '" + importedName + "'";
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
    };
    return ImportNameRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=importNameRule.js.map