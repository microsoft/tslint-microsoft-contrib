import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {SyntaxKind} from './utils/SyntaxKind';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';

type Import = ts.ImportEqualsDeclaration | ts.ImportDeclaration;

/**
 * Implementation of the no-unused-import rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'unused import: ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        const documentRegistry = ts.createDocumentRegistry();
        const languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        const languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoUnusedImportsWalker extends ErrorTolerantWalker {
    private languageServices: ts.LanguageService;
    private cachedSourceText: string;

    public constructor(sourceFile : ts.SourceFile,
                       options : Lint.IOptions,
                       languageServices : ts.LanguageService) {
        super(sourceFile, options);
        this.languageServices = languageServices;
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
    private validateReferencesForVariable(node: Import) {

        if (this.isTsxFile() && this.isReactImport(node)) {
            // react must be imported into tsx components
            return;
        }

        const variableStack: { name: string; position: number; importNode: Import; }[] = [];
        if (node.kind === SyntaxKind.current().ImportEqualsDeclaration) {
            const name: string = (<ts.ImportEqualsDeclaration>node).name.text;
            const position: number = (<ts.ImportEqualsDeclaration>node).name.getStart();
            variableStack.push({ name: name, position: position, importNode: node });
        } else {
            const importClause: ts.ImportClause = (<ts.ImportDeclaration>node).importClause;
            if (importClause != null) {
                if (importClause.name != null) {
                    const name: string = importClause.name.text;
                    const position: number = importClause.getStart();
                    variableStack.push({ name: name, position: position, importNode: node });
                } else if (importClause.namedBindings != null) {
                    if (importClause.namedBindings.kind === SyntaxKind.current().NamespaceImport) {
                        const imports: ts.NamespaceImport = <ts.NamespaceImport>importClause.namedBindings;
                        const name: string = imports.name.text;
                        const position: number = imports.name.getStart();
                        variableStack.push({ name: name, position: position, importNode: node });
                    } else if (importClause.namedBindings.kind === SyntaxKind.current().NamedImports) {
                        const imports: ts.NamedImports = <ts.NamedImports>importClause.namedBindings;
                        imports.elements.forEach((importSpec: ts.ImportSpecifier): void => {
                            const name: string = importSpec.name.text;
                            const position: number = importSpec.name.getStart();
                            variableStack.push({ name: name, position: position, importNode: node });
                        });
                    }
                }
            }
        }

        variableStack.forEach((variable: { name: string; position: number; importNode: Import; }): void => {
            const name: string = variable.name;
            const position: number = variable.position;
            const references = this.languageServices.getReferencesAtPosition('file.ts', position);
            if (references.length <= 1) {
                // there is a bug in how the language services finds nodes in ts and tsx files
                const sourceText: string = this.getSourceText();
                const endOfImport: number = variable.importNode.getEnd();
                const restOfFile: string = sourceText.substring(endOfImport);
                if (new RegExp('\\b(' + name + ')\\b', 'm').test(restOfFile)) {
                    return;
                }
                const failureString = Rule.FAILURE_STRING + '\'' + name + '\'';
                const failure = this.createFailure(position, name.length, failureString);
                this.addFailure(failure);
            }
        });
    }

    private getSourceText(): string {
        if (this.cachedSourceText == null) {
            this.cachedSourceText = this.getSourceFile().text;
        }
        return this.cachedSourceText;
    }

    private isReactImport(node: Import): boolean {
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
