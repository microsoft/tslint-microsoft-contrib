
import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'The exported module name must match the file name. Found: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    }
}

class ExportNameWalker extends ErrorTolerantWalker {

    protected visitExportAssignment(node: ts.ExportAssignment): void {
        var exportedName = node.expression.getText();
        var regex : RegExp = new RegExp(exportedName + '\..*'); // filename must be exported name plus any extension
        if (!regex.test(this.getFilename())) {
            var failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName + ' and ' + exportedName;
            var failure = this.createFailure(node.expression.getStart(), node.expression.getWidth(), failureString);
            this.addFailure(failure);

        }
        super.visitExportAssignment(node);
    }

    private getFilename(): string {
        var filename = this.getSourceFile().fileName;
        var lastSlash = filename.lastIndexOf('/');
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    }
}
