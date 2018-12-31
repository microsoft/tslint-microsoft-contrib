import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const UNMATCHED_FAILURE_STRING: string =
    'Unmatched calls between ReactDOM.render ReactDOM.unmountComponentAtNode. Did you forget to unmount React element?';

const UNSET_FAILURE_STRING: string =
    'Unreference ReactDOM.render captured variable, it leaks to memory leak. Did you forget to set it to undefined?';

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
        commonWeaknessEnumeration: ''
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, this.walk.bind(this));
    }

    private walk(ctx: Lint.WalkContext<void>): void {
        const renderCalls: ts.Node[] = [];
        const unmountCalls: ts.Node[] = [];

        const renderAssignedIdentifiers: ts.Node[] = [];
        const unsetIdentifiers: Set<string> = new Set<string>();

        const callback = (node: ts.Node): void => {
            const reactDOMImportNamespaceName: undefined | string = this.getReactDOMImportNamespaceName(node);
            if (reactDOMImportNamespaceName) {
                this.reactDOMImportNamespaceName = reactDOMImportNamespaceName;
                return;
            }

            const isRenderCallExpression: boolean = this.isReactDOMCallExpression(node, 'render');
            if (isRenderCallExpression) {
                renderCalls.push(node);

                const renderAssignExpression: undefined | [ts.Node, ts.Node] = this.getAssignExpression(node.parent);
                if (renderAssignExpression && renderAssignExpression[1] === node) {
                    renderAssignedIdentifiers.push(renderAssignExpression[0]);
                }

                return;
            }

            const isUnmountCallExpression: boolean = this.isReactDOMCallExpression(node, 'unmountComponentAtNode');
            if (isUnmountCallExpression) {
                unmountCalls.push(node);
                return;
            }

            const assignExpression: undefined | [ts.Node, ts.Node] = this.getAssignExpression(node);
            if (assignExpression && this.isUnsetIdentifier(assignExpression[1])) {
                unsetIdentifiers.add(assignExpression[0].getText());
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

        // Verify the render assigned identifiers are unset somewhere in the file.
        renderAssignedIdentifiers.forEach(identifier => {
            if (!unsetIdentifiers.has(identifier.getText())) {
                ctx.addFailureAtNode(identifier, UNSET_FAILURE_STRING);
            }
        });
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

    private getAssignExpression(node: ts.Node): undefined | [ts.Node, ts.Node] {
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const binaryExpression: ts.BinaryExpression = <ts.BinaryExpression>node;
            return binaryExpression.operatorToken.kind === ts.SyntaxKind.EqualsToken
                ? [binaryExpression.left, binaryExpression.right]
                : undefined;
        }

        if (node.kind === ts.SyntaxKind.VariableDeclaration) {
            const variableDeclaration: ts.VariableDeclaration = <ts.VariableDeclaration>node;
            return variableDeclaration.initializer ? [variableDeclaration.name, variableDeclaration.initializer] : undefined;
        }

        return undefined;
    }

    private isUnsetIdentifier(node: ts.Node): boolean {
        return (
            node.kind === ts.SyntaxKind.NullKeyword ||
            node.kind === ts.SyntaxKind.UndefinedKeyword ||
            (node.kind === ts.SyntaxKind.Identifier && node.getText() === 'undefined')
        );
    }
}
