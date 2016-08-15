import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';
import {Utils} from './utils/Utils';
import {MochaUtils} from './utils/MochaUtils';

const FAILURE_STRING: string = 'Unneeded Mocha Done. Parameter can be safely removed: ';

/**
 * Implementation of the mocha-unneeded-done rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'mocha-unneeded-done',
        type: 'maintainability',
        description: 'A function declares a MochaDone parameter but only resolves it synchronously in the main function.',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MochaUnneededDoneRuleWalker(sourceFile, this.getOptions()));
    }
}

class MochaUnneededDoneRuleWalker extends ErrorTolerantWalker {

    protected visitSourceFile(node: ts.SourceFile): void {
        if (MochaUtils.isMochaTest(node)) {
            super.visitSourceFile(node);
        }
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.validateMochaDoneUsage(node);
        super.visitArrowFunction(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.validateMochaDoneUsage(node);
        super.visitFunctionExpression(node);
    }

    private validateMochaDoneUsage(node: ts.FunctionLikeDeclaration): void {
        const doneIdentifier: ts.Identifier = this.maybeGetMochaDoneParameter(node);
        if (doneIdentifier == null) {
            return;
        }
        if (!this.isIdentifierInvokedDirectlyInBody(doneIdentifier, node)) {
            return;
        }

        const walker: IdentifierReferenceCountWalker = new IdentifierReferenceCountWalker(
            this.getSourceFile(), this.getOptions(), doneIdentifier
        );
        const count: number = walker.getReferenceCount(<ts.Block>node.body);
        if (count === 1) {
            this.addFailure(
                this.createFailure(doneIdentifier.getStart(), doneIdentifier.getWidth(), FAILURE_STRING + doneIdentifier.getText())
            );
        }
    }

    private isIdentifierInvokedDirectlyInBody(doneIdentifier: ts.Identifier, node: ts.FunctionLikeDeclaration): boolean {
        if (node.body == null || node.body.kind !== SyntaxKind.current().Block) {
            return;
        }
        const block: ts.Block = <ts.Block>node.body;
        return Utils.exists(block.statements, (statement: ts.Statement): boolean => {
            if (statement.kind === SyntaxKind.current().ExpressionStatement) {
                const expression: ts.Expression = (<ts.ExpressionStatement>statement).expression;
                if (expression.kind === SyntaxKind.current().CallExpression) {
                    const leftHandSideExpression: ts.Expression = (<ts.CallExpression>expression).expression;
                    return leftHandSideExpression.getText() === doneIdentifier.getText();
                }
            }

            return false;
        });
    }

    private maybeGetMochaDoneParameter(node: ts.FunctionLikeDeclaration): ts.Identifier {
        if (node.parameters.length === 0) {
            return null;
        }
        const allDones: ts.ParameterDeclaration[] = Utils.filter(node.parameters, (parameter: ts.ParameterDeclaration): boolean => {
            if (parameter.type != null && parameter.type.getText() === 'MochaDone') {
                return true;
            }
            return parameter.name.getText() === 'done';
        });

        if (allDones.length === 0 || allDones[0].name.kind !== SyntaxKind.current().Identifier) {
            return null;
        }
        return <ts.Identifier>allDones[0].name;
    }
}

class IdentifierReferenceCountWalker extends ErrorTolerantWalker {

    private identifierText: string;
    private count;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, identifier: ts.Identifier) {
        super(sourceFile, options);
        this.identifierText = identifier.getText();
    }

    public getReferenceCount(body: ts.Block): number {
        this.count = 0;
        body.statements.forEach((statement: ts.Statement): void => {
            this.walk(statement);
        });
        return this.count;
    }


    protected visitIdentifier(node: ts.Identifier): void {
        if (node.getText() === this.identifierText) {
            this.count = this.count + 1;
        }
        super.visitIdentifier(node);
    }
}
