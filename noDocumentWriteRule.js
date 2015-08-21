var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./ErrorTolerantWalker');
var AstUtils = require('./AstUtils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoDocumentWriteWalker(sourceFile, this.getOptions(), languageService));
    };
    Rule.WRITE_FAILURE = 'Forbidden call to document.write';
    Rule.WRITELN_FAILURE = 'Forbidden call to document.writeln';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDocumentWriteWalker = (function (_super) {
    __extends(NoDocumentWriteWalker, _super);
    function NoDocumentWriteWalker(sourceFile, options, languageService) {
        _super.call(this, sourceFile, options);
        this.languageService = languageService;
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }
    NoDocumentWriteWalker.prototype.visitCallExpression = function (node) {
        var functionName = AstUtils.getFunctionName(node);
        if (functionName === 'write' || functionName === 'writeln') {
            var leftSide = node.expression.expression;
            if (leftSide) {
                var leftSideType = this.typeChecker.getTypeAtLocation(leftSide);
                var typeAsString = this.typeChecker.typeToString(leftSideType);
                if (leftSideType.flags === 1 || typeAsString === 'Document') {
                    if (functionName === 'write') {
                        this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.WRITE_FAILURE));
                    }
                    else {
                        this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.WRITELN_FAILURE));
                    }
                }
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoDocumentWriteWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noDocumentWriteRule.js.map