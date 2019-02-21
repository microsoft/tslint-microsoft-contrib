import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { Utils } from './utils/Utils';
import { MochaUtils } from './utils/MochaUtils';

const FAILURE_STRING: string = 'Unneeded Mocha Done. Parameter can be safely removed: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'mocha-unneeded-done',
        type: 'maintainability',
        description: 'A function declares a MochaDone parameter but only resolves it synchronously in the main function.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function validateMochaDoneUsage(node: ts.FunctionLikeDeclaration): void {
        const doneIdentifier = maybeGetMochaDoneParameter(node);
        if (doneIdentifier === undefined) {
            return;
        }
        if (!isIdentifierInvokedDirectlyInBody(doneIdentifier, node)) {
            return;
        }

        const count: number = getReferenceCount(doneIdentifier, <ts.Block>node.body);
        if (count === 1) {
            ctx.addFailureAt(doneIdentifier.getStart(), doneIdentifier.getWidth(), FAILURE_STRING + doneIdentifier.getText());
        }
    }

    function isIdentifierInvokedDirectlyInBody(doneIdentifier: ts.Identifier, node: ts.FunctionLikeDeclaration): boolean {
        if (node.body === undefined || node.body.kind !== ts.SyntaxKind.Block) {
            return false;
        }
        const block: ts.Block = <ts.Block>node.body;
        return Utils.exists(
            block.statements,
            (statement: ts.Statement): boolean => {
                if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
                    const expression: ts.Expression = (<ts.ExpressionStatement>statement).expression;
                    if (expression.kind === ts.SyntaxKind.CallExpression) {
                        const leftHandSideExpression: ts.Expression = (<ts.CallExpression>expression).expression;
                        return leftHandSideExpression.getText() === doneIdentifier.getText();
                    }
                }

                return false;
            }
        );
    }

    function maybeGetMochaDoneParameter(node: ts.FunctionLikeDeclaration): ts.Identifier | undefined {
        if (node.parameters.length === 0) {
            return undefined;
        }
        const allDones: ts.ParameterDeclaration[] = node.parameters.filter(
            (parameter: ts.ParameterDeclaration): boolean => {
                if (parameter.type !== undefined && parameter.type.getText() === 'MochaDone') {
                    return true;
                }
                return parameter.name.getText() === 'done';
            }
        );

        if (allDones.length === 0 || allDones[0].name.kind !== ts.SyntaxKind.Identifier) {
            return undefined;
        }
        return <ts.Identifier>allDones[0].name;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isArrowFunction(node) || tsutils.isFunctionExpression(node)) {
            validateMochaDoneUsage(node);
        }

        return ts.forEachChild(node, cb);
    }

    if (MochaUtils.isMochaTest(ctx.sourceFile)) {
        ts.forEachChild(ctx.sourceFile, cb);
    }
}

function getReferenceCount(identifier: ts.Identifier, body: ts.Block): number {
    let count = 0;
    const identifierText = identifier.getText();

    function cb(node: ts.Node) {
        if (tsutils.isIdentifier(node)) {
            if (node.getText() === identifierText) {
                count += 1;
            }
        }

        ts.forEachChild(node, cb);
    }

    body.statements.forEach(cb);

    return count;
}
