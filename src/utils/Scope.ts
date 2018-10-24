import * as ts from 'typescript';
import * as Lint from 'tslint';
import {AstUtils} from './AstUtils';

/**
 * Tracks nested scope of variables.
 */
export class Scope {
    public parent: Scope | undefined;
    private symbols: { [index: string]: number } = {};

    constructor(parent: Scope | undefined) {
        this.parent = parent;
    }

    public addFunctionSymbol(symbolString: string): void {
        this.symbols[symbolString] = ts.SyntaxKind.FunctionType;
    }

    public addNonFunctionSymbol(symbolString: string): void {
        this.symbols[symbolString] = ts.SyntaxKind.Unknown;
    }

    public isFunctionSymbol(symbolString: string): boolean {
        if (this.symbols[symbolString] === ts.SyntaxKind.FunctionType) {
            return true;
        }
        if (this.symbols[symbolString] === ts.SyntaxKind.Unknown) {
            return false;
        }
        if (this.parent !== undefined) {
            return this.parent.isFunctionSymbol(symbolString);
        }
        return false;
    }

    public addParameters(parameters: ReadonlyArray<ts.ParameterDeclaration>): void {
        parameters.forEach((parm: ts.ParameterDeclaration): void => {
            if (AstUtils.isDeclarationFunctionType(parm)) {
                this.addFunctionSymbol(parm.name.getText());
            } else {
                this.addNonFunctionSymbol(parm.name.getText());
            }
        });
    }

    public addGlobalScope(node: ts.Node, sourceFile : ts.SourceFile, options : Lint.IOptions): void {
        const refCollector = new GlobalReferenceCollector(sourceFile, options);
        refCollector.visitNode(node);
        refCollector.functionIdentifiers.forEach((identifier: string): void => { this.addFunctionSymbol(identifier); });
        refCollector.nonFunctionIdentifiers.forEach((identifier: string): void => { this.addNonFunctionSymbol(identifier); });
    }
}

class GlobalReferenceCollector extends Lint.RuleWalker {
    public functionIdentifiers: string[] = [];
    public nonFunctionIdentifiers: string[] = [];

    /* tslint:disable:no-empty */
    protected visitModuleDeclaration(): void { }   // do not descend into fresh scopes
    protected visitClassDeclaration(): void { }     // do not descend into fresh scopes
    protected visitArrowFunction(): void { }           // do not descend into fresh scopes
    protected visitFunctionExpression(): void { } // do not descend into fresh scopes
    /* tslint:enable:no-empty */

    // need to make this public so it can be invoked outside of class
    /* tslint:disable:no-unnecessary-override */
    public visitNode(node: ts.Node): void {
        super.visitNode(node);
    }
    /* tslint:enable:no-unnecessary-override */

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (AstUtils.isDeclarationFunctionType(node)) {
            this.functionIdentifiers.push(node.name.getText());
        } else {
            this.nonFunctionIdentifiers.push(node.name.getText());
        }
        // do not descend
    }
}
