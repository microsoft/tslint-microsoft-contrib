import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const UNMATCHED_FAILURE_STRING: string =
    'Unmatched calls between ReactDOM.render ReactDOM.unmountComponentAtNode. Did you forget to unmount React element?';

export class Rule extends Lint.Rules.AbstractRule {
    private reactDOMImportNamespaceName: undefined | string;

    public static metadata: ExtendedMetadata = {
        ruleName: 'pair-react-dom-render-unmount',
        type: 'maintainability',
        description: 'Pair ReactDOM render and unmount calls in one file.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '...' // if possible, please map your rule to a CWE (see cwe_descriptions.json and https://cwe.mitre.org)
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, this.walk.bind(this));
    }

    private walk(ctx: Lint.WalkContext<void>): void {
        const renderCalls: ts.Node[] = [];
        const unmountCalls: ts.Node[] = [];

        const callback = (node: ts.Node): void => {
            const reactDOMImportNamespaceName: undefined | string = this.getReactDOMImportNamespaceName(node);
            if (reactDOMImportNamespaceName) {
                this.reactDOMImportNamespaceName = reactDOMImportNamespaceName;
                return;
            }

            const isRenderCallExpression: boolean = this.isReactDOMCallExpression(node, 'render');
            if (isRenderCallExpression) {
                renderCalls.push(node);
                return;
            }

            const isUnmountCallExpression: boolean = this.isReactDOMCallExpression(node, 'unmountComponentAtNode');
            if (isUnmountCallExpression) {
                unmountCalls.push(node);
                return;
            }

            ts.forEachChild(node, callback);
        };

        ts.forEachChild(ctx.sourceFile, callback);

        // Verify the count of render calls and unmount calls are the same in the file.
        if (renderCalls.length !== unmountCalls.length) {
            renderCalls.forEach(renderCallExpression => {
                ctx.addFailureAtNode(renderCallExpression, UNMATCHED_FAILURE_STRING);
            });
        }
    }

    private getReactDOMImportNamespaceName(node: ts.Node): undefined | string {
        if (node.kind !== ts.SyntaxKind.ImportDeclaration) {
            return undefined;
        }

        const importDeclaration: ts.ImportDeclaration = <ts.ImportDeclaration>node;
        if (importDeclaration.moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
            return undefined;
        }

        const importModuleSpecifier: ts.StringLiteral = <ts.StringLiteral>importDeclaration.moduleSpecifier;
        if (
            importModuleSpecifier.text === 'react-dom' &&
            importDeclaration.importClause &&
            importDeclaration.importClause.namedBindings &&
            importDeclaration.importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport
        ) {
            const namespaceImport: ts.NamespaceImport = <ts.NamespaceImport>importDeclaration.importClause.namedBindings;
            return namespaceImport.name.text;
        }

        return undefined;
    }

    private isReactDOMCallExpression(node: ts.Node, methodName: string): boolean {
        if (node.kind !== ts.SyntaxKind.CallExpression) {
            return false;
        }

        const callExpression: ts.CallExpression = <ts.CallExpression>node;
        if (callExpression.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            return false;
        }

        const propertyAccessExpression: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>callExpression.expression;
        if (propertyAccessExpression.expression.kind !== ts.SyntaxKind.Identifier) {
            return false;
        }

        const propertyAccessor: ts.Identifier = <ts.Identifier>propertyAccessExpression.expression;
        return propertyAccessor.text === this.reactDOMImportNamespaceName && propertyAccessExpression.name.text === methodName;
    }
}
