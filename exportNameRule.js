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
var AstUtils_1 = require("./utils/AstUtils");
exports.OPTION_IGNORE_CASE = 'ignore-case';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    };
    Rule.getExceptions = function (options) {
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return typeof options[0] === 'object' ? options[0].allow : options;
        }
        return undefined;
    };
    Rule.getIgnoreCase = function (options) {
        if (options instanceof Array) {
            return typeof options[0] === 'object' ? options[0]['ignore-case'] : true;
        }
        return true;
    };
    Rule.metadata = {
        ruleName: 'export-name',
        type: 'maintainability',
        description: 'The name of the exported module must match the filename of the source file',
        options: {
            type: 'list',
            listType: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'object',
                        properties: {
                            'ignore-case': {
                                type: 'boolean'
                            },
                            allow: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                ]
            }
        },
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };
    Rule.FAILURE_STRING = 'The exported module or identifier name must match the file name. Found: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function isExportedDeclaration(element) {
    return element.modifiers !== undefined && AstUtils_1.AstUtils.hasModifier(element.modifiers, ts.SyntaxKind.ExportKeyword);
}
function isExportStatement(node) {
    return ts.isExportAssignment(node) || ts.isExportDeclaration(node);
}
function getExportsFromStatement(node) {
    if (ts.isExportAssignment(node)) {
        return [[node.expression.getText(), node.expression]];
    }
    else {
        var symbolAndNodes_1 = [];
        node.exportClause.elements.forEach(function (e) {
            symbolAndNodes_1.push([e.name.getText(), node]);
        });
        return symbolAndNodes_1;
    }
}
var ExportNameWalker = (function (_super) {
    __extends(ExportNameWalker, _super);
    function ExportNameWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportNameWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        var singleExport = node.statements.filter(isExportStatement);
        if (singleExport.length === 1) {
            var symbolsAndNodes = getExportsFromStatement(singleExport[0]);
            if (symbolsAndNodes.length === 1) {
                this.validateExport(symbolsAndNodes[0][0], symbolsAndNodes[0][1]);
            }
            return;
        }
        var exportedTopLevelElements = node.statements.filter(isExportedDeclaration);
        if (exportedTopLevelElements.length === 0) {
            node.statements.forEach(function (element) {
                if (element.kind === ts.SyntaxKind.ModuleDeclaration) {
                    var exportStatements = _this.getExportStatementsWithinModules(element) || [];
                    exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
                }
            });
        }
        this.validateExportedElements(exportedTopLevelElements);
    };
    ExportNameWalker.prototype.getExportStatementsWithinModules = function (moduleDeclaration) {
        if (moduleDeclaration.body.kind === ts.SyntaxKind.ModuleDeclaration) {
            return this.getExportStatementsWithinModules(moduleDeclaration.body);
        }
        else if (moduleDeclaration.body.kind === ts.SyntaxKind.ModuleBlock) {
            var moduleBlock = moduleDeclaration.body;
            return moduleBlock.statements.filter(isExportedDeclaration);
        }
        return undefined;
    };
    ExportNameWalker.prototype.validateExportedElements = function (exportedElements) {
        if (exportedElements.length === 1) {
            var element = exportedElements[0];
            if (ts.isModuleDeclaration(element) || ts.isClassDeclaration(element) || ts.isFunctionDeclaration(element)) {
                if (element.name !== undefined) {
                    this.validateExport(element.name.text, exportedElements[0]);
                }
            }
            else if (exportedElements[0].kind === ts.SyntaxKind.VariableStatement) {
                var variableStatement = exportedElements[0];
                if (variableStatement.declarationList.declarations.length === 1) {
                    var variableDeclaration = variableStatement.declarationList.declarations[0];
                    this.validateExport(variableDeclaration.name.getText(), variableDeclaration);
                }
            }
        }
    };
    ExportNameWalker.prototype.validateExport = function (exportedName, node) {
        var flags = Rule.getIgnoreCase(this.getOptions()) ? 'i' : '';
        var regex = new RegExp("^" + exportedName + "\\..+", flags);
        var fileName = Utils_1.Utils.fileBasename(this.getSourceFile().fileName);
        if (!regex.test(fileName)) {
            if (!this.isSuppressed(exportedName)) {
                var failureString = Rule.FAILURE_STRING + fileName + ' and ' + exportedName;
                this.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }
    };
    ExportNameWalker.prototype.isSuppressed = function (exportedName) {
        var allExceptions = Rule.getExceptions(this.getOptions());
        return Utils_1.Utils.exists(allExceptions, function (exception) {
            return new RegExp(exception).test(exportedName);
        });
    };
    return ExportNameWalker;
}(Lint.RuleWalker));
exports.ExportNameWalker = ExportNameWalker;
//# sourceMappingURL=exportNameRule.js.map