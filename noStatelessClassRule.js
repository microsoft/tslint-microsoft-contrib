"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var SyntaxKind = require('./utils/SyntaxKind');
var AstUtils = require('./utils/AstUtils');
var Utils = require('./utils/Utils');
var FAILURE_STRING = 'A stateless class was found. This indicates a failure in the object model: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoStatelessClassRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoStatelessClassRuleWalker = (function (_super) {
    __extends(NoStatelessClassRuleWalker, _super);
    function NoStatelessClassRuleWalker() {
        _super.apply(this, arguments);
    }
    NoStatelessClassRuleWalker.prototype.visitClassDeclaration = function (node) {
        if (!this.isClassStateful(node)) {
            var className = node.name == null ? '<unknown>' : node.name.text;
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + className));
        }
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    NoStatelessClassRuleWalker.prototype.isClassStateful = function (node) {
        if (Utils.exists(node.heritageClauses, function (clause) {
            return clause.token === SyntaxKind.current().ExtendsKeyword;
        })) {
            return true;
        }
        if (node.members.length === 0) {
            return false;
        }
        return Utils.exists(node.members, function (classElement) {
            if (classElement.kind === SyntaxKind.current().Constructor) {
                return false;
            }
            if (AstUtils.isStatic(classElement)) {
                return false;
            }
            return true;
        });
    };
    return NoStatelessClassRuleWalker;
}(ErrorTolerantWalker));
//# sourceMappingURL=noStatelessClassRule.js.map