import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import AstUtils = require('./utils/AstUtils');

/**
 * Implementation of the no-unused-import rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'unused import: ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        var referencedDotImports : { [index: string]: boolean; } = this.getReferencedDotImports(sourceFile, this.getOptions());
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService, referencedDotImports));
    }

    private getReferencedDotImports(sourceFile : ts.SourceFile, options : Lint.IOptions) : { [index: string]: boolean; } {
        var gatherImportHandler = new GatherNoRequireImportsWalker(sourceFile, options);
        this.applyWithWalker(gatherImportHandler);
        return gatherImportHandler.noRequireReferences;
    }
}

class GatherNoRequireImportsWalker extends Lint.RuleWalker {
    public noRequireReferences: { [index: string]: boolean; } = {};

    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        var moduleReference = node.moduleReference;
        if (moduleReference.kind === SyntaxKind.current().QualifiedName) {
            if ((<any>moduleReference).left != null) {
                this.gatherReferenceFromImport((<any>moduleReference).left.text);
            }
        }
        super.visitImportEqualsDeclaration(node);
    }


    private gatherReferenceFromImport(qualifiedName : string) : void {
        if (qualifiedName) {
            qualifiedName.split('.').forEach((name : string) => {
                this.noRequireReferences[name] = true;
            });
        }
    }
}

class NoUnusedImportsWalker extends ErrorTolerantWalker {
    private languageServices: ts.LanguageService;
    private noRequireReferences: { [index: string]: boolean; } = {};

    public constructor(sourceFile : ts.SourceFile,
                       options : Lint.IOptions,
                       languageServices : ts.LanguageService,
                       noRequireReferences: { [index: string]: boolean; }) {
        super(sourceFile, options);
        this.languageServices = languageServices;
        this.noRequireReferences = noRequireReferences;
    }


    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        if (!AstUtils.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword)) {
            this.validateReferencesForVariable(node);
        }
        super.visitImportEqualsDeclaration(node);
    }


    protected visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (!AstUtils.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword)) {
            this.validateReferencesForVariable(node);
        }
        super.visitImportDeclaration(node);
    }

    /**
     * As described in  https://github.com/palantir/tslint/issues/325,
     * the language service in typescript 1.4 doesn't seem to search for references in other imports.
     * This will be fixed, but we can work around it by keeping track for the import references manually.
     */
    private validateReferencesForVariable(node: ts.ImportEqualsDeclaration | ts.ImportDeclaration) {
        const variableStack: { name: string; position: number; }[] = [];
        if (node.kind === SyntaxKind.current().ImportEqualsDeclaration) {
            const name: string = (<ts.ImportEqualsDeclaration>node).name.text;
            const position: number = (<ts.ImportEqualsDeclaration>node).name.getStart();
            variableStack.push({ name: name, position: position });
        } else {
            const importClause: ts.ImportClause = (<ts.ImportDeclaration>node).importClause;
            if (importClause != null) {
                if (importClause.name != null) {
                    const name: string = importClause.name.text;
                    const position: number = importClause.getStart();
                    variableStack.push({ name: name, position: position });
                } else if (importClause.namedBindings != null) {
                    if (importClause.namedBindings.kind === SyntaxKind.current().NamespaceImport) {
                        const imports: ts.NamespaceImport = <ts.NamespaceImport>importClause.namedBindings;
                        const name: string = imports.name.text;
                        const position: number = imports.name.getStart();
                        variableStack.push({ name: name, position: position });
                    } else if (importClause.namedBindings.kind === SyntaxKind.current().NamedImports) {
                        const imports: ts.NamedImports = <ts.NamedImports>importClause.namedBindings;
                        imports.elements.forEach((importSpec: ts.ImportSpecifier): void => {
                            const name: string = importSpec.name.text;
                            const position: number = importSpec.name.getStart();
                            variableStack.push({ name: name, position: position });
                        });
                    }
                }
            }
        }

        variableStack.forEach((variable: { name: string; position: number; }): void => {
            const name: string = variable.name;
            const position: number = variable.position;
            var references = this.languageServices.getReferencesAtPosition('file.ts', position);
            if (references.length <= 1 && !this.noRequireReferences[name]) {
                if (this.isTsxFile()) {
                    // react must be imported into tsx components
                    if (this.isReactImport(node)) {
                        return;
                    }
                    // there is a bug in how the language services finds nodes in tsx files
                    if (new RegExp('\\b(' + name + ')\\b', 'm').test(this.getSourceFile().text)) {
                        return;
                    }
                }
                var failureString = Rule.FAILURE_STRING + '\'' + name + '\'';
                var failure = this.createFailure(position, name.length, failureString);
                this.addFailure(failure);
            }
        });
    }

    private isReactImport(node: ts.ImportEqualsDeclaration | ts.ImportDeclaration): boolean {
        if (node.kind === SyntaxKind.current().ImportEqualsDeclaration) {
            const importDeclaration: ts.ImportEqualsDeclaration = <ts.ImportEqualsDeclaration>node;
            if (importDeclaration.moduleReference.kind === SyntaxKind.current().ExternalModuleReference) {
                const moduleExpression: ts.Expression = (<ts.ExternalModuleReference>importDeclaration.moduleReference).expression;
                return this.isModuleExpressionReact(moduleExpression);
            }
        } else if (node.kind === SyntaxKind.current().ImportDeclaration) {
            const importDeclaration: ts.ImportDeclaration = <ts.ImportDeclaration>node;
            const moduleExpression: ts.Expression = importDeclaration.moduleSpecifier;
            return this.isModuleExpressionReact(moduleExpression);
        }
        return false;
    }

    private isModuleExpressionReact(moduleExpression: ts.Expression): boolean {
        if (moduleExpression != null && moduleExpression.kind === SyntaxKind.current().StringLiteral) {
            const moduleName: ts.StringLiteral = <ts.StringLiteral>moduleExpression;
            return /react/i.test(moduleName.text);
        }
        return false;
    }

    private isTsxFile(): boolean {
        return /.*\.tsx/.test(this.getSourceFile().fileName);
    }
}
