import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import {ErrorTolerantWalker} from './ErrorTolerantWalker';
import {SyntaxKind} from './SyntaxKind';
import {AstUtils} from './AstUtils';

/**
 * Tracks nested scope of variables.
 */
export class Scope {
    public parent: Scope;
    private symbols: { [index: string]: number } = {};

    constructor(parent: Scope) {
        this.parent = parent;
    }

    public addFunctionSymbol(symbolString: string): void {
        this.symbols[symbolString] = SyntaxKind.current().FunctionType;
    }

    public addNonFunctionSymbol(symbolString: string): void {
        this.symbols[symbolString] = SyntaxKind.current().Unknown;
    }

    public isFunctionSymbol(symbolString: string): boolean {
        if (this.symbols[symbolString] === SyntaxKind.current().FunctionType) {
            return true;
        }
        if (this.symbols[symbolString] === SyntaxKind.current().Unknown) {
            return false;
        }
        if (this.parent != null) {
            return this.parent.isFunctionSymbol(symbolString);
        }
        return false;
    }

    public addParameters(parameters: ts.ParameterDeclaration[]): void {
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

class GlobalReferenceCollector extends ErrorTolerantWalker {
    public functionIdentifiers: string[] = [];
    public nonFunctionIdentifiers: string[] = [];

    /* tslint:disable:no-empty */
    protected visitModuleDeclaration(node: ts.ModuleDeclaration): void { }   // do not descend into fresh scopes
    protected visitClassDeclaration(node: ts.ClassDeclaration): void { }     // do not descend into fresh scopes
    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void { } // do not descend into fresh scopes
    protected visitFunctionExpression(node: ts.FunctionExpression): void { } // do not descend into fresh scopes
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
