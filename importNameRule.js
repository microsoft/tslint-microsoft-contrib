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
var Utils_1 = require("./utils/Utils");
var TypeGuard_1 = require("./utils/TypeGuard");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImportNameRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'import-name',
        type: 'maintainability',
        description: 'The name of the imported module must match the name of the thing being imported',
        hasFix: true,
        options: null,
        optionsDescription: '',
        optionExamples: [
            [true],
            [true, { moduleName: 'importedName' }],
            [true, { moduleName: 'importedName' }, ['moduleName1', 'moduleName2']],
            [true, { moduleName: 'importedName' }, ['moduleName1', 'moduleName2'], { ignoreExternalModule: false }]
        ],
        typescriptOnly: true,
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
var ImportNameRuleWalker = (function (_super) {
    __extends(ImportNameRuleWalker, _super);
    function ImportNameRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.option = _this.extractOptions();
        return _this;
    }
    ImportNameRuleWalker.prototype.extractOptions = function () {
        var _this = this;
        var result = {
            replacements: {},
            ignoredList: [],
            config: {
                ignoreExternalModule: true
            }
        };
        this.getOptions().forEach(function (opt, index) {
            if (index === 1 && TypeGuard_1.isObject(opt)) {
                result.replacements = _this.extractReplacements(opt);
            }
            if (index === 2 && Array.isArray(opt)) {
                result.ignoredList = _this.extractIgnoredList(opt);
            }
            if (index === 3 && TypeGuard_1.isObject(opt)) {
                result.config = _this.extractConfig(opt);
            }
        });
        return result;
    };
    ImportNameRuleWalker.prototype.extractReplacements = function (opt) {
        var result = {};
        if (TypeGuard_1.isObject(opt)) {
            Object.keys(opt).forEach(function (key) {
                var value = opt[key];
                if (typeof value === 'string') {
                    result[key] = value;
                }
            });
        }
        return result;
    };
    ImportNameRuleWalker.prototype.extractIgnoredList = function (opt) {
        return opt.filter(function (moduleName) { return typeof moduleName === 'string'; });
    };
    ImportNameRuleWalker.prototype.extractConfig = function (opt) {
        var result = { ignoreExternalModule: true };
        var configKeyLlist = ['ignoreExternalModule'];
        if (TypeGuard_1.isObject(opt)) {
            return Object.keys(opt).reduce(function (accum, key) {
                if (configKeyLlist.filter(function (configKey) { return configKey === key; }).length >= 1) {
                    accum[key] = opt[key];
                    return accum;
                }
                return accum;
            }, { ignoreExternalModule: true });
        }
        return result;
    };
    ImportNameRuleWalker.prototype.visitImportEqualsDeclaration = function (node) {
        var name = node.name.text;
        if (node.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
            var moduleRef = node.moduleReference;
            if (moduleRef.expression.kind === ts.SyntaxKind.StringLiteral) {
                var moduleName = moduleRef.expression.text;
                this.validateImport(node, name, moduleName);
            }
        }
        else if (node.moduleReference.kind === ts.SyntaxKind.QualifiedName) {
            var moduleName = node.moduleReference.getText();
            moduleName = moduleName.replace(/.*\./, '');
            this.validateImport(node, name, moduleName);
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    ImportNameRuleWalker.prototype.visitImportDeclaration = function (node) {
        if (node.importClause.name !== undefined) {
            var name_1 = node.importClause.name.text;
            if (node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
                var moduleName = node.moduleSpecifier.text;
                this.validateImport(node, name_1, moduleName);
            }
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    ImportNameRuleWalker.prototype.validateImport = function (node, importedName, moduleName) {
        var expectedImportedName = moduleName.replace(/.*\//, '');
        if (expectedImportedName === '' || expectedImportedName === '.' || expectedImportedName === '..') {
            return;
        }
        expectedImportedName = this.makeCamelCase(expectedImportedName);
        if (this.isImportNameValid(importedName, expectedImportedName, moduleName, node) === false) {
            var message = "Misnamed import. Import should be named '" + expectedImportedName + "' but found '" + importedName + "'";
            var nameNode = node.kind === ts.SyntaxKind.ImportEqualsDeclaration
                ? node.name
                : node.importClause.name;
            var nameNodeStartPos = nameNode.getStart();
            var fix = new Lint.Replacement(nameNodeStartPos, nameNode.end - nameNodeStartPos, expectedImportedName);
            this.addFailureAt(node.getStart(), node.getWidth(), message, fix);
        }
    };
    ImportNameRuleWalker.prototype.makeCamelCase = function (input) {
        return input.replace(/[-|\.|_](.)/g, function (_match, group1) {
            return group1.toUpperCase();
        });
    };
    ImportNameRuleWalker.prototype.isImportNameValid = function (importedName, expectedImportedName, moduleName, node) {
        if (expectedImportedName === importedName) {
            return true;
        }
        var isReplacementsExist = this.checkReplacementsExist(importedName, expectedImportedName, moduleName, this.option.replacements);
        if (isReplacementsExist) {
            return true;
        }
        var isIgnoredModuleExist = this.checkIgnoredListExists(moduleName, this.option.ignoredList);
        if (isIgnoredModuleExist) {
            return true;
        }
        var ignoreThisExternalModule = this.checkIgnoreExternalModule(moduleName, node, this.option.config);
        if (ignoreThisExternalModule) {
            return true;
        }
        return false;
    };
    ImportNameRuleWalker.prototype.checkReplacementsExist = function (importedName, expectedImportedName, moduleName, replacements) {
        var allowedReplacementKeys = [expectedImportedName, moduleName, moduleName.replace(/.*\//, '')];
        return Utils_1.Utils.exists(Object.keys(replacements), function (replacementKey) {
            for (var index = 0; allowedReplacementKeys.length > index; index = index + 1) {
                if (replacementKey === allowedReplacementKeys[index]) {
                    return importedName === replacements[replacementKey];
                }
            }
            return false;
        });
    };
    ImportNameRuleWalker.prototype.checkIgnoredListExists = function (moduleName, ignoredList) {
        return ignoredList.filter(function (ignoredModule) { return ignoredModule === moduleName; }).length >= 1;
    };
    ImportNameRuleWalker.prototype.checkIgnoreExternalModule = function (moduleName, node, opt) {
        var runtimeNode = node;
        if (opt.ignoreExternalModule === true && runtimeNode.parent !== undefined && runtimeNode.parent.resolvedModules !== undefined) {
            var ignoreThisExternalModule_1 = false;
            runtimeNode.parent.resolvedModules.forEach(function (value, key) {
                if (key === moduleName && value.isExternalLibraryImport === true) {
                    ignoreThisExternalModule_1 = true;
                }
            });
            return ignoreThisExternalModule_1;
        }
        return false;
    };
    return ImportNameRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=importNameRule.js.map