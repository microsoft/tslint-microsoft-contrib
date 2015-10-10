
import ErrorTolerantWalker = require('./ErrorTolerantWalker');
import Utils = require('./Utils');

/**
 * Implementation of the export-name rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'The exported module name must match the file name. Found: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    }

    public static getExceptions(options : Lint.IOptions) : string[] {
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return <string[]><any>options; // MSE version of tslint somehow requires this
        }
        return null;
    }
}

class ExportNameWalker extends ErrorTolerantWalker {

    protected visitExportAssignment(node: ts.ExportAssignment): void {
        var exportedName = node.expression.getText();
        var regex : RegExp = new RegExp(exportedName + '\..*'); // filename must be exported name plus any extension
        if (!regex.test(this.getFilename())) {
            if (!this.isSuppressed(exportedName)) {
                var failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName + ' and ' + exportedName;
                var failure = this.createFailure(node.expression.getStart(), node.expression.getWidth(), failureString);
                this.addFailure(failure);
            }
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

    private isSuppressed(exportedName: string) : boolean {
        var allExceptions : string[] = Rule.getExceptions(this.getOptions());

        return Utils.exists(allExceptions, (exception: string) : boolean => {
            return new RegExp(exception).test(exportedName);
        });
    }
}
