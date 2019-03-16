import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Unnecessary local variable: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-local-variable',
        type: 'maintainability',
        description: 'Do not declare a variable only to return it from the function on the next line.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '563, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    const variableUsages: Map<ts.Identifier, tsutils.VariableInfo> = tsutils.collectVariableUsage(ctx.sourceFile);

    function validateStatementArray(statements: ts.NodeArray<ts.Statement>): void {
        if (statements === undefined || statements.length < 2) {
            return; // one liners are always valid
        }

        const lastStatement = statements[statements.length - 1];
        const nextToLastStatement = statements[statements.length - 2];

        const returnedVariableName = tryToGetReturnedVariableName(lastStatement);
        const declaredVariableIdentifier = tryToGetDeclaredVariable(nextToLastStatement);
        if (declaredVariableIdentifier === undefined) {
            return;
        }

        const declaredVariableName: string = declaredVariableIdentifier.text;

        if (
            returnedVariableName !== undefined &&
            declaredVariableName !== undefined &&
            returnedVariableName === declaredVariableName &&
            variableIsOnlyUsedOnce(declaredVariableIdentifier)
        ) {
            ctx.addFailureAt(nextToLastStatement.getStart(), nextToLastStatement.getWidth(), FAILURE_STRING + returnedVariableName);
        }
    }

    function tryToGetDeclaredVariable(statement: ts.Statement): ts.Identifier | undefined {
        if (statement !== undefined && tsutils.isVariableStatement(statement)) {
            if (statement.declarationList.declarations.length === 1) {
                const declaration: ts.VariableDeclaration = statement.declarationList.declarations[0];
                if (declaration.name && tsutils.isIdentifier(declaration.name)) {
                    return declaration.name;
                }
            }
        }
        return undefined;
    }

    function tryToGetReturnedVariableName(statement: ts.Statement): string | undefined {
        if (statement !== undefined && tsutils.isReturnStatement(statement)) {
            if (statement.expression && tsutils.isIdentifier(statement.expression)) {
                return statement.expression.text;
            }
        }
        return undefined;
    }

    function variableIsOnlyUsedOnce(declaredVariableIdentifier: ts.Identifier) {
        const usage = variableUsages.get(declaredVariableIdentifier);
        return usage !== undefined && usage.uses.length === 1;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isBlock(node) || tsutils.isSourceFile(node) || tsutils.isCaseClause(node) || tsutils.isDefaultClause(node)) {
            validateStatementArray(node.statements);
        }

        if (tsutils.isModuleDeclaration(node)) {
            if (node.body && tsutils.isModuleBlock(node.body)) {
                validateStatementArray(node.body.statements);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
