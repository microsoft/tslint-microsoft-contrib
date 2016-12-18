import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the prefer-const rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'prefer-const',
        type: 'maintainability',
        description: 'Use const to declare variables if they are only assigned a value once.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 705, 710'
    };

    public static FAILURE_STRING_FACTORY(identifier: string): string {
        return `Identifier '${identifier}' never appears ` +
            'on the LHS of an assignment - use const instead of let for its declaration.';
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferConstWalker(sourceFile, this.getOptions()));
    }
}

interface IDeclarationUsages {
    declaration: ts.VariableDeclaration;
    usages: number;
}

class PreferConstWalker extends ErrorTolerantWalker {
    private inScopeLetDeclarations: ts.Map<IDeclarationUsages>[] = [];
    private errors: Lint.RuleFailure[] = [];

    public visitSourceFile(node: ts.SourceFile) {
        this.visitAnyStatementList(node.statements);
        super.visitSourceFile(node);
        this.popDeclarations();

        // Sort errors by position because tslint doesn't
        this.errors.sort((a, b) => {
            return a.getStartPosition().getPosition() - b.getStartPosition().getPosition();
        }).forEach(e => this.addFailure(e));
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (AstUtils.isAssignmentOperator(node.operatorToken.kind)) {
            this.visitLeftHandSideExpression(node.left);
        }

        super.visitBinaryExpression(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        this.visitAnyUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    public visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        this.visitAnyUnaryExpression(node);
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
        this.visitAnyForStatement(node);
        super.visitForOfStatement(node);
        this.popDeclarations();
    }

    public visitForInStatement(node: ts.ForInStatement) {
        this.visitAnyForStatement(node);
        super.visitForInStatement(node);
        this.popDeclarations();
    }

    public visitBlock(node: ts.Block | ts.ModuleBlock) {
        this.visitAnyStatementList(node.statements);
        super.visitBlock(<ts.Block>node);
        this.popDeclarations();
    }

    private visitAnyStatementList(statements: ts.NodeArray<ts.Statement>) {
        const names: ts.Map<IDeclarationUsages> = <ts.Map<IDeclarationUsages>>{};
        statements.forEach((statement: ts.Statement): void => {
            if (statement.kind === ts.SyntaxKind.VariableStatement) {
                this.collectLetIdentifiers((<ts.VariableStatement>statement).declarationList, names);
            }
        });
        this.inScopeLetDeclarations.push(names);
    }

    private visitAnyForStatement(node: ts.ForOfStatement | ts.ForInStatement) {
        const names: ts.Map<IDeclarationUsages> = <ts.Map<IDeclarationUsages>>{};
        if (AstUtils.isLet(node.initializer)) {
            if (node.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                this.collectLetIdentifiers(<ts.VariableDeclarationList>node.initializer, names);
            }
        }

        this.inScopeLetDeclarations.push(names);
    }

    private popDeclarations(): void {
        const completed = this.inScopeLetDeclarations.pop();

        Object.keys(completed).forEach((name: string): void => {
            if (Object.hasOwnProperty.call(completed, name)) {
                const element = completed[name];
                if (element.usages === 0) {
                    this.errors.push(this.createFailure(element.declaration.getStart(this.getSourceFile()),
                        element.declaration.getWidth(this.getSourceFile()),
                        Rule.FAILURE_STRING_FACTORY(name)));
                }
            }
        });
    }

    private visitAnyUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression): void {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.visitLeftHandSideExpression(node.operand);
        }
    }

    private collectLetIdentifiers(list: ts.VariableDeclarationList, ret: ts.Map<IDeclarationUsages>): void {
        list.declarations.forEach((node: ts.VariableDeclaration): void => {
            if (AstUtils.isLet(node) && !AstUtils.isExported(node)) {
                this.collectNameIdentifiers(node, node.name, ret);
            }
        });
    }

    private visitLeftHandSideExpression(node: ts.Expression): void {
        while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
            node = (<ts.ParenthesizedExpression>node).expression;
        }

        if (node.kind === ts.SyntaxKind.Identifier) {
            this.markAssignment(<ts.Identifier>node);
        } else if (AstUtils.isBindingLiteralExpression(node)) {
            this.visitBindingLiteralExpression(<ts.ArrayLiteralExpression | ts.ObjectLiteralExpression>node);
        }
    }

    private visitBindingLiteralExpression(node: ts.ArrayLiteralExpression | ts.ObjectLiteralExpression): void {
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const pattern = <ts.ObjectLiteralExpression>node;
            pattern.properties.forEach((element): void => {
                const kind = element.kind;

                if (kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
                    this.markAssignment((<ts.ShorthandPropertyAssignment>element).name);
                } else if (kind === ts.SyntaxKind.PropertyAssignment) {
                    this.visitLeftHandSideExpression((<ts.PropertyAssignment>element).initializer);
                }
            });
        } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const pattern = <ts.ArrayLiteralExpression>node;
            pattern.elements.forEach((element): void => {
                this.visitLeftHandSideExpression(element);
            });
        }
    }

    private visitBindingPatternIdentifiers(pattern: ts.BindingPattern): void {
        if (pattern.kind === ts.SyntaxKind.ObjectBindingPattern) {
            const objPattern: ts.ObjectBindingPattern = <ts.ObjectBindingPattern>pattern;
            objPattern.elements.forEach((element: ts.BindingElement): void => {
                if ((<any>element).kind === ts.SyntaxKind.OmittedExpression) {
                    return;
                } else if ((<ts.Node>element.name).kind === ts.SyntaxKind.Identifier) {
                    this.markAssignment(<ts.Identifier>element.name);
                } else {
                    this.visitBindingPatternIdentifiers(<ts.BindingPattern>element.name);
                }
            });
        }
    }

    /* tslint:disable:no-increment-decrement */
    private markAssignment(identifier: ts.Identifier): void {
        const name = identifier.text;
        for (let i = this.inScopeLetDeclarations.length - 1; i >= 0; i--) {
            const declarations = this.inScopeLetDeclarations[i];
            if (declarations[name]) {
                declarations[name].usages += 1;
                break;
            }
        }
    }
    /* tslint:enable:no-increment-decrement */

    private collectNameIdentifiers(declaration: ts.VariableDeclaration,
                                   node: ts.Identifier | ts.BindingPattern,
                                   table: ts.Map<IDeclarationUsages>): void {
        if (node.kind === ts.SyntaxKind.Identifier) {
            table[(<ts.Identifier>node).text] = { declaration, usages: 0 };
        } else {
            this.collectBindingPatternIdentifiers(declaration, <ts.BindingPattern>node, table);
        }
    }

    private collectBindingPatternIdentifiers(value: ts.VariableDeclaration,
                                             pattern: ts.BindingPattern,
                                             table: ts.Map<IDeclarationUsages>): void {
        if (pattern.kind === ts.SyntaxKind.ObjectBindingPattern) {
            const objPattern: ts.ObjectBindingPattern = <ts.ObjectBindingPattern>pattern;
            objPattern.elements.forEach((element): void => {
                if ((<any>element).kind === ts.SyntaxKind.OmittedExpression) {
                    return;
                }
                this.collectNameIdentifiers(value, element.name, table);
            });
        }
    }
}
