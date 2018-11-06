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
var TypeGuard_1 = require("./TypeGuard");
var BannedTermWalker = (function (_super) {
    __extends(BannedTermWalker, _super);
    function BannedTermWalker(sourceFile, options, failureString, bannedTerms) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allowQuotedProperties = false;
        _this.failureString = failureString;
        _this.bannedTerms = bannedTerms;
        _this.getOptions().forEach(function (opt) {
            if (TypeGuard_1.isObject(opt)) {
                _this.allowQuotedProperties = opt['allow-quoted-properties'] === true;
            }
        });
        return _this;
    }
    BannedTermWalker.prototype.visitVariableDeclaration = function (node) {
        this.validateNode(node);
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    BannedTermWalker.prototype.visitFunctionDeclaration = function (node) {
        this.validateNode(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    BannedTermWalker.prototype.visitPropertyDeclaration = function (node) {
        this.validateNode(node);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    BannedTermWalker.prototype.visitPropertySignature = function (node) {
        if (node.kind === ts.SyntaxKind.PropertySignature) {
            var signature = node;
            var propertyName = signature.name;
            if (this.allowQuotedProperties === false || propertyName.kind !== ts.SyntaxKind.StringLiteral) {
                this.validateNode(node);
            }
        }
        else {
            this.validateNode(node);
        }
        _super.prototype.visitPropertySignature.call(this, node);
    };
    BannedTermWalker.prototype.visitSetAccessor = function (node) {
        this.validateNode(node);
        _super.prototype.visitSetAccessor.call(this, node);
    };
    BannedTermWalker.prototype.visitGetAccessor = function (node) {
        this.validateNode(node);
        _super.prototype.visitGetAccessor.call(this, node);
    };
    BannedTermWalker.prototype.visitMethodDeclaration = function (node) {
        this.validateNode(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    BannedTermWalker.prototype.visitParameterDeclaration = function (node) {
        if (node.name.getText() !== 'this') {
            this.validateNode(node);
        }
        _super.prototype.visitParameterDeclaration.call(this, node);
    };
    BannedTermWalker.prototype.validateNode = function (node) {
        if (TypeGuard_1.isNamed(node)) {
            var text = node.name.getText();
            if (text !== undefined) {
                if (this.isBannedTerm(text)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), this.failureString + text);
                }
            }
        }
    };
    BannedTermWalker.prototype.isBannedTerm = function (text) {
        return this.bannedTerms.indexOf(text) !== -1;
    };
    return BannedTermWalker;
}(Lint.RuleWalker));
exports.BannedTermWalker = BannedTermWalker;
//# sourceMappingURL=BannedTermWalker.js.map