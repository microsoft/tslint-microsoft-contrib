"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var Lint = require('tslint/lib/lint');
var SyntaxKind = require('./utils/SyntaxKind');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var AstUtils = require('./utils/AstUtils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        var referencedDotImports = this.getReferencedDotImports(sourceFile, this.getOptions());
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService, referencedDotImports));
    };
    Rule.prototype.getReferencedDotImports = function (sourceFile, options) {
        var gatherImportHandler = new GatherNoRequireImportsWalker(sourceFile, options);
        this.applyWithWalker(gatherImportHandler);
        return gatherImportHandler.noRequireReferences;
    };
    Rule.FAILURE_STRING = 'unused import: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var GatherNoRequireImportsWalker = (function (_super) {
    __extends(GatherNoRequireImportsWalker, _super);
    function GatherNoRequireImportsWalker() {
        _super.apply(this, arguments);
        this.noRequireReferences = {};
    }
    GatherNoRequireImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        var moduleReference = node.moduleReference;
        if (moduleReference.kind === SyntaxKind.current().QualifiedName) {
            if (moduleReference.left != null) {
                this.gatherReferenceFromImport(moduleReference.left.text);
            }
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    GatherNoRequireImportsWalker.prototype.gatherReferenceFromImport = function (qualifiedName) {
        var _this = this;
        if (qualifiedName) {
            qualifiedName.split('.').forEach(function (name) {
                _this.noRequireReferences[name] = true;
            });
        }
    };
    return GatherNoRequireImportsWalker;
}(Lint.RuleWalker));
var NoUnusedImportsWalker = (function (_super) {
    __extends(NoUnusedImportsWalker, _super);
    function NoUnusedImportsWalker(sourceFile, options, languageServices, noRequireReferences) {
        _super.call(this, sourceFile, options);
        this.noRequireReferences = {};
        this.languageServices = languageServices;
        this.noRequireReferences = noRequireReferences;
    }
    NoUnusedImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        if (!AstUtils.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword)) {
            this.validateReferencesForVariable(node);
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    NoUnusedImportsWalker.prototype.visitImportDeclaration = function (node) {
        if (!AstUtils.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword)) {
            this.validateReferencesForVariable(node);
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    NoUnusedImportsWalker.prototype.validateReferencesForVariable = function (node) {
        var _this = this;
        var variableStack = [];
        if (node.kind === SyntaxKind.current().ImportEqualsDeclaration) {
            var name_1 = node.name.text;
            var position = node.name.getStart();
            variableStack.push({ name: name_1, position: position });
        }
        else {
            var importClause = node.importClause;
            if (importClause != null) {
                if (importClause.name != null) {
                    var name_2 = importClause.name.text;
                    var position = importClause.getStart();
                    variableStack.push({ name: name_2, position: position });
                }
                else if (importClause.namedBindings != null) {
                    if (importClause.namedBindings.kind === SyntaxKind.current().NamespaceImport) {
                        var imports = importClause.namedBindings;
                        var name_3 = imports.name.text;
                        var position = imports.name.getStart();
                        variableStack.push({ name: name_3, position: position });
                    }
                    else if (importClause.namedBindings.kind === SyntaxKind.current().NamedImports) {
                        var imports = importClause.namedBindings;
                        imports.elements.forEach(function (importSpec) {
                            var name = importSpec.name.text;
                            var position = importSpec.name.getStart();
                            variableStack.push({ name: name, position: position });
                        });
                    }
                }
            }
        }
        variableStack.forEach(function (variable) {
            var name = variable.name;
            var position = variable.position;
            var references = _this.languageServices.getReferencesAtPosition('file.ts', position);
            if (references.length <= 1 && !_this.noRequireReferences[name]) {
                if (_this.isTsxFile()) {
                    if (_this.isReactImport(node)) {
                        return;
                    }
                    if (new RegExp('\\b(' + name + ')\\b', 'm').test(_this.getSourceFile().text)) {
                        return;
                    }
                }
                var failureString = Rule.FAILURE_STRING + '\'' + name + '\'';
                var failure = _this.createFailure(position, name.length, failureString);
                _this.addFailure(failure);
            }
        });
    };
    NoUnusedImportsWalker.prototype.isReactImport = function (node) {
        if (node.kind === SyntaxKind.current().ImportEqualsDeclaration) {
            var importDeclaration = node;
            if (importDeclaration.moduleReference.kind === SyntaxKind.current().ExternalModuleReference) {
                var moduleExpression = importDeclaration.moduleReference.expression;
                return this.isModuleExpressionReact(moduleExpression);
            }
        }
        else if (node.kind === SyntaxKind.current().ImportDeclaration) {
            var importDeclaration = node;
            var moduleExpression = importDeclaration.moduleSpecifier;
            return this.isModuleExpressionReact(moduleExpression);
        }
        return false;
    };
    NoUnusedImportsWalker.prototype.isModuleExpressionReact = function (moduleExpression) {
        if (moduleExpression != null && moduleExpression.kind === SyntaxKind.current().StringLiteral) {
            var moduleName = moduleExpression;
            return /react/i.test(moduleName.text);
        }
        return false;
    };
    NoUnusedImportsWalker.prototype.isTsxFile = function () {
        return /.*\.tsx/.test(this.getSourceFile().fileName);
    };
    return NoUnusedImportsWalker;
}(ErrorTolerantWalker));
//# sourceMappingURL=noUnusedImportsRule.js.map