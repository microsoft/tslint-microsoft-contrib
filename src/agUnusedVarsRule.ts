import * as ts from  "../node_modules/typescript/lib/typescript";
import * as Lint from "../node_modules/tslint/lib/lint"; // >=version 3.
import SyntaxKind = require('./utils/SyntaxKind');
import AstUtils = require('./utils/AstUtils');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//import * as ts from "typescript";
//import * as Lint from "../lint";

const OPTION_REACT = "react";
const OPTION_CHECK_PARAMETERS = "check-parameters";

const REACT_MODULES = ["react", "react/addons"];
const REACT_NAMESPACE_IMPORT_NAME = "React";

const MODULE_SPECIFIER_MATCH = /^["'](.+)['"]$/;

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused ";
    public static FAILURE_STRING_VARS = "variable";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        return this.applyWithWalker(new AngularJSUnusedVarsWalker(sourceFile, this.getOptions(), languageService));
    }
}

class AngularJSUnusedVarsWalker extends Lint.RuleWalker {
    private languageService: ts.LanguageService;
    private skipBindingElement: boolean;
    private skipParameterDeclaration: boolean;
    private skipVariableDeclaration: boolean;

    private reactImport: ts.NamespaceImport;
    private hasSeenJsxElement: boolean;
    private isReactUsed: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
        this.skipBindingElement = false;
        this.hasSeenJsxElement = false;
        this.isReactUsed = false;
    }

    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        /*
         * After super.visitSourceFile() is completed, this.reactImport will be set to a NamespaceImport iff:
         *
         * - a react option has been provided to the rule and
         * - an import of a module that matches one of OPTION_REACT_MODULES is found, to a
         *   NamespaceImport named OPTION_REACT_NAMESPACE_IMPORT_NAME
         *
         * e.g.
         *
         * import * as React from "react/addons";
         *
         * If reactImport is defined when a walk is completed, we need to have:
         *
         * a) seen another usage of React and/or
         * b) seen a JSX identifier
         *
         * otherwise a a variable usage failure will will be reported
         */
        if (this.hasOption(OPTION_REACT)
            && this.reactImport != null
            && !this.isReactUsed
            && !this.hasSeenJsxElement) {
            const nameText = this.reactImport.name.getText();
            this.addFailure(this.createFailure(this.reactImport.name.getStart(), nameText.length, `${Rule.FAILURE_STRING}${Rule.FAILURE_STRING_VARS}: '${nameText}'`));
        }
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (Lint.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword, SyntaxKind.current().DeclareKeyword)) {
            var skipBindingElement: boolean = this.skipBindingElement; this.skipBindingElement = true;
            var skipParameterDeclaration: boolean = this.skipParameterDeclaration; this.skipParameterDeclaration = true;
            var skipVariableDeclaration: boolean = this.skipVariableDeclaration; this.skipVariableDeclaration = true;
            super.visitModuleDeclaration(node);
            this.skipParameterDeclaration = skipParameterDeclaration;
            this.skipBindingElement = skipBindingElement;
            this.skipVariableDeclaration = skipVariableDeclaration;
        } else {
            super.visitModuleDeclaration(node);
        }
    }
    
    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === SyntaxKind.current().Identifier;

        if (isSingleVariable && !this.skipBindingElement) {
            const variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(Rule.FAILURE_STRING_VARS, variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitBindingElement(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration needs to be there but doesn't need to be used
        this.visitBlock(node.block);
    }

    // skip exported and declared functions
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        if (! this.skipParameterDeclaration && !Lint.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword, SyntaxKind.current().DeclareKeyword)) {
            const variableName = node.name.text;
            this.validateReferencesForVariable("Function", variableName, node.name.getStart());
        }

        super.visitFunctionDeclaration(node);
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        var skipParameterDeclaration: boolean = this.skipParameterDeclaration; this.skipParameterDeclaration = true;
        super.visitFunctionType(node);
        this.skipParameterDeclaration = skipParameterDeclaration;
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        if (!Lint.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword)) {
            const importClause = node.importClause;

            // named imports & namespace imports handled by other walker methods
            // importClause will be null for bare imports
            if (importClause != null && importClause.name != null) {
                const variableIdentifier = importClause.name;
                this.validateReferencesForVariable("named imports", variableIdentifier.text, variableIdentifier.getStart());
            }
        }

        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        if (!Lint.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword)) {
            const name = node.name;
            this.validateReferencesForVariable("named imports", name.text, name.getStart());
        }
        super.visitImportEqualsDeclaration(node);
    }

    // skip parameters in index signatures (stuff like [key: string]: string)
    public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
        var skipParameterDeclaration: boolean = this.skipParameterDeclaration; this.skipParameterDeclaration = true;
        super.visitIndexSignatureDeclaration(node);
        this.skipParameterDeclaration = skipParameterDeclaration;
    }

    // skip parameters in interfaces
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        var skipParameterDeclaration: boolean = this.skipParameterDeclaration; this.skipParameterDeclaration = true;
        super.visitInterfaceDeclaration(node);
        this.skipParameterDeclaration = skipParameterDeclaration;
    }

    public visitJsxElement(node: ts.JsxElement) {
        this.hasSeenJsxElement = true;
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
        this.hasSeenJsxElement = true;
        super.visitJsxSelfClosingElement(node);
    }

    // check private member functions
    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (node.name != null && node.name.kind === SyntaxKind.current().Identifier) {
            const modifiers = node.modifiers;
            const variableName = (<ts.Identifier> node.name).text;

            if (Lint.hasModifier(modifiers, SyntaxKind.current().PrivateKeyword)) {
                this.validateReferencesForVariable("Method", variableName, node.name.getStart());
            }
        }
        var skipParameterDeclaration: boolean = this.skipParameterDeclaration;
        // abstract methods can't have a body so their parameters are always unused
        if (Lint.hasModifier(node.modifiers, SyntaxKind.current().AbstractKeyword)) {
            this.skipParameterDeclaration = true;
        }
        super.visitMethodDeclaration(node);
        this.skipParameterDeclaration = skipParameterDeclaration;
    }

    public visitNamedImports(node: ts.NamedImports) {
        for (const namedImport of node.elements) {
            this.validateReferencesForVariable("named imports", namedImport.name.text, namedImport.name.getStart());
        }
        super.visitNamedImports(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport) {
        const importDeclaration = <ts.ImportDeclaration> node.parent.parent;
        const moduleSpecifier = importDeclaration.moduleSpecifier.getText();

        // extract the unquoted module being imported
        const moduleNameMatch = moduleSpecifier.match(MODULE_SPECIFIER_MATCH);
        const isReactImport = (moduleNameMatch != null) && (REACT_MODULES.indexOf(moduleNameMatch[1]) !== -1);

        if (this.hasOption(OPTION_REACT) && isReactImport && node.name.text === REACT_NAMESPACE_IMPORT_NAME) {
            this.reactImport = node;
            const fileName = this.getSourceFile().fileName;
            const position = node.name.getStart();
            const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
            if (highlights != null && highlights[0].highlightSpans.length > 1) {
                this.isReactUsed = true;
            }
        } else {
            this.validateReferencesForVariable("Namespace", node.name.text, node.name.getStart());
        }
        super.visitNamespaceImport(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        const isSingleVariable = node.name.kind === SyntaxKind.current().Identifier;
        const isPropertyParameter = Lint.hasModifier(
            node.modifiers,
            SyntaxKind.current().PublicKeyword,
            SyntaxKind.current().PrivateKeyword,
            SyntaxKind.current().ProtectedKeyword
            );
        var skipBindingElement: boolean = this.skipBindingElement;
        if (!isSingleVariable && isPropertyParameter) {
            // tsc error: a parameter property may not be a binding pattern
            this.skipBindingElement = true;
        }

        if (this.hasOption(OPTION_CHECK_PARAMETERS)
            && isSingleVariable
            && !this.skipParameterDeclaration
            && !Lint.hasModifier(node.modifiers, SyntaxKind.current().PublicKeyword)) {
            const nameNode = <ts.Identifier> node.name;
            this.validateReferencesForVariable("Parameter", nameNode.text, node.name.getStart());
        }

        super.visitParameterDeclaration(node);
        this.skipBindingElement = skipBindingElement;
    }

    // check private member variables
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.name != null && node.name.kind === SyntaxKind.current().Identifier) {
            const modifiers = node.modifiers;
            const variableName = (<ts.Identifier> node.name).text;

            // check only if an explicit 'private' modifier is specified
            if (this.hasOption("publicProperty") || Lint.hasModifier(modifiers, SyntaxKind.current().PrivateKeyword)) {
                this.validateReferencesForVariable("ClassProperty", variableName, node.name.getStart());
            }
        }

        super.visitPropertyDeclaration(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === SyntaxKind.current().Identifier;

        if (isSingleVariable && !this.skipVariableDeclaration) {
            const variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(Rule.FAILURE_STRING_VARS, variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitVariableDeclaration(node);
    }

    // skip exported and declared variables
    public visitVariableStatement(node: ts.VariableStatement) {
        var skipBindingElement: boolean = this.skipBindingElement;
        var skipVariableDeclaration: boolean = this.skipVariableDeclaration;
        if (Lint.hasModifier(node.modifiers, SyntaxKind.current().ExportKeyword, SyntaxKind.current().DeclareKeyword)) {
            this.skipBindingElement = true;
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipBindingElement = skipBindingElement;
        this.skipVariableDeclaration = skipVariableDeclaration;
    }

    private validateReferencesForVariable(nameType: string, name: string, position: number) {
        const fileName = this.getSourceFile().fileName;
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        if (highlights == null || highlights[0].highlightSpans.length <= 1) {
            this.addFailure(this.createFailure(position, name.length, `${Rule.FAILURE_STRING}${nameType}: '${name}'`));
        }
    }
}
