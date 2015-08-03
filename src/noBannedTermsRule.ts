
import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden reference to banned term: ';
    public static BANNED_TERMS : string[] = [ 'caller', 'callee', 'arguments', 'eval' ];

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoBannedTermsWalker(sourceFile, this.getOptions()));
    }
}

class NoBannedTermsWalker extends ErrorTolerantWalker {

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        this.validateNode(node);
        super.visitVariableDeclaration(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validateNode(node);
        super.visitFunctionDeclaration(node);
    }


    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        this.validateNode(node);
        super.visitPropertyDeclaration(node);
    }


    protected visitPropertySignature(node: ts.Node): void {
        this.validateNode(node);
        super.visitPropertySignature(node);
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration): void {
        this.validateNode(node);
        super.visitSetAccessor(node);
    }

    protected visitGetAccessor(node: ts.AccessorDeclaration): void {
        this.validateNode(node);
        super.visitGetAccessor(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validateNode(node);
        super.visitMethodDeclaration(node);
    }

    protected visitParameterDeclaration(node: ts.ParameterDeclaration): void {
        this.validateNode(node);
        super.visitParameterDeclaration(node);
    }

    validateNode(node: ts.Node) : void {
        if ((<any>node).name) {
            if ((<any>node).name.text) {
                var text : string = (<any>node).name.text;
                if (this.isBannedTerm(text)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + text));
                }
            }
        }
    }

    private isBannedTerm(text : string) : boolean {
        return Rule.BANNED_TERMS.indexOf(text) !== -1;
    }
}
