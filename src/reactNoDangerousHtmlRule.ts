import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

interface Exception {
    file: string;
    method: string;
    comment: string;
}

/**
 * Implementation of the react-no-dangerous-html rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost(sourceFile.fileName, sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        return this.applyWithWalker(new NoDangerousHtmlWalker(sourceFile, this.getOptions(), languageService));
    }

    /**
     * Exposed for testing.
     */
    public static getExceptions(options : Lint.IOptions) : Exception[] {
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return <Exception[]><any>options; // MSE version of tslint somehow requires this
        }
        return null;
    }
}

class NoDangerousHtmlWalker extends ErrorTolerantWalker {

    private languageServices : ts.LanguageService;
    private currentMethodName : string;

    constructor(sourceFile : ts.SourceFile, options : Lint.IOptions, languageServices : ts.LanguageService) {
        super(sourceFile, options);
        this.languageServices = languageServices;
        this.currentMethodName = '<unknown>';
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.currentMethodName = (<any>node.name).text;
        super.visitMethodDeclaration(node);
        this.currentMethodName = '<unknown>';
    }

    protected visitPropertyAssignment(node: ts.PropertyAssignment): void {
        super.visitPropertyAssignment(node);
        var keyNode : ts.DeclarationName = node.name;

        if (keyNode.kind === SyntaxKind.current().Identifier) {
            if ((<any>keyNode).text === 'dangerouslySetInnerHTML') {
                if (!this.isSuppressed(this.currentMethodName)) {
                    var failureString = 'Invalid call to dangerouslySetInnerHTML in method "' + this.currentMethodName + '"\n' +
                        '    of source file ' + this.getSourceFile().fileName + '"\n' +
                        '    Do *NOT* add a suppression for this warning. If you absolutely must use this API then you need\n' +
                        '    to review the usage with a security expert/QE representative. If they decide that this is an\n' +
                        '    acceptable usage then add the exception to xss_exceptions.json';
                    var position = node.getStart();
                    var failure = this.createFailure(position, (<any>keyNode).text.length, failureString);
                    this.addFailure(failure);
                }
            }
        }
        super.visitPropertyAssignment(node);
    }

    private isSuppressed(methodName : string): boolean {
        var exceptions : Exception[] = Rule.getExceptions(this.getOptions());
        if (exceptions == null || exceptions.length === 0) {
            return false; // no file specified means the usage is not suppressed
        }
        var found = false;
        exceptions.forEach((exception : Exception) : void => {
            if (exception.file === this.getSourceFile().fileName) {
                if (exception.method === methodName) {
                    if (exception.comment != null) {
                        found = true;
                    }
                }
            }
        });
        return found;
    }
}
