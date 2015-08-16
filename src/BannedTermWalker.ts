import ErrorTolerantWalker = require('./ErrorTolerantWalker');

class BannedTermWalker extends ErrorTolerantWalker {

    private failureString : string;
    private bannedTerms: string[];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, failureString : string, bannedTerms: string[]) {
        super(sourceFile, options);
        this.failureString = failureString;
        this.bannedTerms = bannedTerms;
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

    private validateNode(node: ts.Node) : void {
        if ((<any>node).name) {
            if ((<any>node).name.text) {
                var text : string = (<any>node).name.text;
                if (this.isBannedTerm(text)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.failureString + text));
                }
            }
        }
    }

    private isBannedTerm(text : string) : boolean {
        return this.bannedTerms.indexOf(text) !== -1;
    }

}

export = BannedTermWalker;