var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./ErrorTolerantWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'The exported module name must match the file name. Found: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var ExportNameWalker = (function (_super) {
    __extends(ExportNameWalker, _super);
    function ExportNameWalker() {
        _super.apply(this, arguments);
    }
    ExportNameWalker.prototype.visitExportAssignment = function (node) {
        var exportedName = node.expression.getText();
        var regex = new RegExp(exportedName + '\..*');
        if (!regex.test(this.getFilename())) {
            var failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName + ' and ' + exportedName;
            var failure = this.createFailure(node.expression.getStart(), node.expression.getWidth(), failureString);
            this.addFailure(failure);
        }
        _super.prototype.visitExportAssignment.call(this, node);
    };
    ExportNameWalker.prototype.getFilename = function () {
        var filename = this.getSourceFile().fileName;
        var lastSlash = filename.lastIndexOf('/');
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    };
    return ExportNameWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=exportNameRule.js.map