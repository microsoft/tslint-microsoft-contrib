var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './utils/SyntaxKind', './utils/ErrorTolerantWalker'], function (require, exports) {
    var SyntaxKind = require('./utils/SyntaxKind');
    var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        Rule.prototype.apply = function (sourceFile) {
            var documentRegistry = ts.createDocumentRegistry();
            var languageServiceHost = Lint.createLanguageServiceHost(sourceFile.fileName, sourceFile.getFullText());
            var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
            return this.applyWithWalker(new NoDangerousHtmlWalker(sourceFile, this.getOptions(), languageService));
        };
        Rule.getExceptions = function (options) {
            if (options.ruleArguments instanceof Array) {
                return options.ruleArguments[0];
            }
            if (options instanceof Array) {
                return options;
            }
            return null;
        };
        return Rule;
    })(Lint.Rules.AbstractRule);
    exports.Rule = Rule;
    var NoDangerousHtmlWalker = (function (_super) {
        __extends(NoDangerousHtmlWalker, _super);
        function NoDangerousHtmlWalker(sourceFile, options, languageServices) {
            _super.call(this, sourceFile, options);
            this.languageServices = languageServices;
            this.currentMethodName = '<unknown>';
        }
        NoDangerousHtmlWalker.prototype.visitMethodDeclaration = function (node) {
            this.currentMethodName = node.name.text;
            _super.prototype.visitMethodDeclaration.call(this, node);
            this.currentMethodName = '<unknown>';
        };
        NoDangerousHtmlWalker.prototype.visitPropertyAssignment = function (node) {
            _super.prototype.visitPropertyAssignment.call(this, node);
            var keyNode = node.name;
            if (keyNode.kind === SyntaxKind.current().Identifier) {
                if (keyNode.text === 'dangerouslySetInnerHTML') {
                    if (!this.isSuppressed(this.currentMethodName)) {
                        var failureString = 'Invalid call to dangerouslySetInnerHTML in method "' + this.currentMethodName + '"\n' +
                            '    of source file ' + this.getSourceFile().fileName + '"\n' +
                            '    Do *NOT* add a suppression for this warning. If you absolutely must use this API then you need\n' +
                            '    to review the usage with a security expert/QE representative. If they decide that this is an\n' +
                            '    acceptable usage then add the exception to xss_exceptions.json';
                        var position = node.getStart();
                        var failure = this.createFailure(position, keyNode.text.length, failureString);
                        this.addFailure(failure);
                    }
                }
            }
            _super.prototype.visitPropertyAssignment.call(this, node);
        };
        NoDangerousHtmlWalker.prototype.isSuppressed = function (methodName) {
            var _this = this;
            var exceptions = Rule.getExceptions(this.getOptions());
            if (exceptions == null || exceptions.length === 0) {
                return false;
            }
            var found = false;
            exceptions.forEach(function (exception) {
                if (exception.file === _this.getSourceFile().fileName) {
                    if (exception.method === methodName) {
                        if (exception.comment != null) {
                            found = true;
                        }
                    }
                }
            });
            return found;
        };
        return NoDangerousHtmlWalker;
    })(ErrorTolerantWalker);
});
//# sourceMappingURL=reactNoDangerousHtmlRule.js.map