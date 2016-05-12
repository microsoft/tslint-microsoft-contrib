import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the prefer-const rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_FACTORY = (identifier: string) => `Identifier '${identifier}' never appears ` +
        'on the LHS of an assignment - use const instead of let for its declaration.';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferConstWalker(sourceFile, this.getOptions()));
    }
}

function isBindingPattern(node: ts.Node): node is ts.BindingPattern {
    return !!node && (node.kind === ts.SyntaxKind.ArrayBindingPattern ||
        node.kind === ts.SyntaxKind.ObjectBindingPattern);
}

function walkUpBindingElementsAndPatterns(node: ts.Node): ts.Node {
    while (node && (node.kind === ts.SyntaxKind.BindingElement || isBindingPattern(node))) {
        node = node.parent;
    }

    return node;
}

function getCombinedNodeFlags(node: ts.Node): ts.NodeFlags {
    node = walkUpBindingElementsAndPatterns(node);

    let flags = node.flags;
    if (node.kind === ts.SyntaxKind.VariableDeclaration) {
        node = node.parent;
    }

    if (node && node.kind === ts.SyntaxKind.VariableDeclarationList) {
        /* tslint:disable:no-bitwise */
        flags |= node.flags;
        /* tslint:enable:no-bitwise */
        node = node.parent;
    }

    if (node && node.kind === ts.SyntaxKind.VariableStatement) {
        /* tslint:disable:no-bitwise */
        flags |= node.flags;
        /* tslint:enable:no-bitwise */
    }

    return flags;
}

function isLet(node: ts.Node): boolean {
    /* tslint:disable:no-bitwise */
    return !!(getCombinedNodeFlags(node) & ts.NodeFlags.Let);
    /* tslint:enable:no-bitwise */
}

function isExported(node: ts.Node): boolean {
    /* tslint:disable:no-bitwise */
    return !!(getCombinedNodeFlags(node) & ts.NodeFlags.Export);
    /* tslint:enable:no-bitwise */
}

function isAssignmentOperator(token: ts.SyntaxKind): boolean {
    return token >= ts.SyntaxKind.FirstAssignment && token <= ts.SyntaxKind.LastAssignment;
}

function isBindingLiteralExpression(node: ts.Node):
    node is (ts.ArrayLiteralExpression | ts.ObjectLiteralExpression) {
    return (!!node) && (node.kind === ts.SyntaxKind.ObjectLiteralExpression ||
        node.kind === ts.SyntaxKind.ArrayLiteralExpression);
}

interface IDeclarationUsages {
    declaration: ts.VariableDeclaration;
    usages: number;
}

class PreferConstWalker extends ErrorTolerantWalker {
    private inScopeLetDeclarations: ts.Map<IDeclarationUsages>[] = [];
    private errors: Lint.RuleFailure[] = [];

    public visitSourceFile(node: ts.SourceFile) {
        this._visitAnyStatementList(node.statements);
        super.visitSourceFile(node);
        this._popDeclarations();

        // Sort errors by position because tslint doesn't
        this.errors.sort((a, b) => {
            return a.getStartPosition().getPosition() - b.getStartPosition().getPosition();
        }).forEach(e => this.addFailure(e));
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (isAssignmentOperator(node.operatorToken.kind)) {
            this._visitLeftHandSideExpression(node.left);
        }

        super.visitBinaryExpression(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        this._visitAnyUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    public visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        this._visitAnyUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (node.body.kind === ts.SyntaxKind.ModuleBlock) {
            // For some reason module blocks are left out of the visit block traversal
            this.visitBlock(<ts.ModuleBlock>node.body);
        }

        super.visitModuleDeclaration(node);
    }

    public visitForOfStatement(node: ts.ForOfStatement) {
        this._visitAnyForStatement(node);
        super.visitForOfStatement(node);
        this._popDeclarations();
    }

    public visitForInStatement(node: ts.ForInStatement) {
        this._visitAnyForStatement(node);
        super.visitForInStatement(node);
        this._popDeclarations();
    }

    public visitBlock(node: ts.Block) {
        this._visitAnyStatementList(node.statements);
        super.visitBlock(node);
        this._popDeclarations();
    }

    private _visitAnyStatementList(statements: ts.NodeArray<ts.Statement>) {
        const names: ts.Map<IDeclarationUsages> = {};
        for (const statement of statements) {
            if (statement.kind === ts.SyntaxKind.VariableStatement) {
                this._collectLetIdentifiers((<ts.VariableStatement>statement).declarationList, names);
            }
        }

        this.inScopeLetDeclarations.push(names);
    }

    private _visitAnyForStatement(node: ts.ForOfStatement | ts.ForInStatement) {
        const names: ts.Map<IDeclarationUsages> = {};
        if (isLet(node.initializer)) {
            if (node.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                this._collectLetIdentifiers(<ts.VariableDeclarationList>node.initializer, names);
            }
        }

        this.inScopeLetDeclarations.push(names);
    }

    private _popDeclarations(): void {
        const completed = this.inScopeLetDeclarations.pop();
        const completedKeys = Object.keys(completed);

        /* tslint:disable:no-increment-decrement */
        for (let i = 0; i < completedKeys.length; i++) {
        /* tslint:enable:no-increment-decrement */
            const name = completedKeys[i];
            if (Object.hasOwnProperty.call(completed, name)) {
                const element = completed[name];
                if (element.usages === 0) {
                    this.errors.push(this.createFailure(element.declaration.getStart(this.getSourceFile()),
                        element.declaration.getWidth(this.getSourceFile()),
                        Rule.FAILURE_STRING_FACTORY(name)));
                }
            }
        }
    }

    private _visitAnyUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression): void {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            this._visitLeftHandSideExpression(node.operand);
        }
    }

    private _collectLetIdentifiers(list: ts.VariableDeclarationList, ret: ts.Map<IDeclarationUsages>): void {
        for (const node of list.declarations) {
            if (isLet(node) && !isExported(node)) {
                this._collectNameIdentifiers(node, node.name, ret);
            }
        }
    }

    private _visitLeftHandSideExpression(node: ts.Expression): void {
        while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
            node = (<ts.ParenthesizedExpression>node).expression;
        }

        if (node.kind === ts.SyntaxKind.Identifier) {
            this._markAssignment(<ts.Identifier>node);
        } else if (isBindingLiteralExpression(node)) {
            this._visitBindingLiteralExpression(<ts.ArrayLiteralExpression | ts.ObjectLiteralExpression>node);
        }
    }

    private _visitBindingLiteralExpression(node: ts.ArrayLiteralExpression | ts.ObjectLiteralExpression): void {
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const pattern = <ts.ObjectLiteralExpression>node;
            for (const element of pattern.properties) {
                const kind = element.kind;

                if (kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
                    this._markAssignment((<ts.ShorthandPropertyAssignment>element).name);
                } else if (kind === ts.SyntaxKind.PropertyAssignment) {
                    this._visitLeftHandSideExpression((<ts.PropertyAssignment>element).initializer);
                }
            }
        } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const pattern = <ts.ArrayLiteralExpression>node;
            for (const element of pattern.elements) {
                this._visitLeftHandSideExpression(element);
            }
        }
    }

    private _visitBindingPatternIdentifiers(pattern: ts.BindingPattern): void {
        for (const element of pattern.elements) {
            if (element.name.kind === ts.SyntaxKind.Identifier) {
                this._markAssignment(<ts.Identifier>element.name);
            } else {
                this._visitBindingPatternIdentifiers(<ts.BindingPattern>element.name);
            }
        }
    }

    private _markAssignment(identifier: ts.Identifier): void {
        const name = identifier.text;
        /* tslint:disable:no-increment-decrement */
        for (let i = this.inScopeLetDeclarations.length - 1; i >= 0; i--) {
        /* tslint:enable:no-increment-decrement */
            const declarations = this.inScopeLetDeclarations[i];
            if (declarations[name]) {
                /* tslint:disable:no-increment-decrement */
                declarations[name].usages++;
                /* tslint:enable:no-increment-decrement */
                break;
            }
        }
    }

    private _collectNameIdentifiers(declaration: ts.VariableDeclaration,
        node: ts.Identifier | ts.BindingPattern,
        table: ts.Map<IDeclarationUsages>): void {
        if (node.kind === ts.SyntaxKind.Identifier) {
            table[(<ts.Identifier>node).text] = { declaration, usages: 0 };
        } else {
            this._collectBindingPatternIdentifiers(declaration, <ts.BindingPattern>node, table);
        }
    }

    private _collectBindingPatternIdentifiers(value: ts.VariableDeclaration,
        pattern: ts.BindingPattern,
        table: ts.Map<IDeclarationUsages>): void {
        for (const element of pattern.elements) {
            this._collectNameIdentifiers(value, element.name, table);
        }
    }
}
