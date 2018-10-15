import * as ts from 'typescript';
import * as Lint from 'tslint';
import {ErrorTolerantWalker} from './ErrorTolerantWalker';

export class BannedTermWalker extends ErrorTolerantWalker {
    private failureString : string;
    private bannedTerms: string[];
    private allowQuotedProperties: boolean = false;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, failureString : string, bannedTerms: string[]) {
        super(sourceFile, options);
        this.failureString = failureString;
        this.bannedTerms = bannedTerms;
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                this.allowQuotedProperties = opt['allow-quoted-properties'] === true;
            }
        });
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
        if (node.kind === ts.SyntaxKind.PropertySignature) {
            const signature: ts.PropertySignature = <ts.PropertySignature>node;
            const propertyName = signature.name;
            // ignore StringLiteral property names if that option is set
            if (this.allowQuotedProperties === false || propertyName.kind !== ts.SyntaxKind.StringLiteral) {
                this.validateNode(node);
            }
        } else {
            this.validateNode(node);
        }
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
        // typescript 2.0 introduces function level 'this' types
        if (node.name.getText() !== 'this') {
            this.validateNode(node);
        }
        super.visitParameterDeclaration(node);
    }

    private validateNode(node: ts.Node) : void {
        if ((<any>node).name) {
            if ((<any>node).name.text) {
                const text : string = (<any>node).name.text;
                if (this.isBannedTerm(text)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), this.failureString + text);
                }
            }
        }
    }

    private isBannedTerm(text : string) : boolean {
        return this.bannedTerms.indexOf(text) !== -1;
    }

}