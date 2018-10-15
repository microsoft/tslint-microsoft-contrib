import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Unnecessary local variable: ';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-local-variable',
        type: 'maintainability',
        description: 'Do not declare a variable only to return it from the function on the next line.',
        options: null,
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
        return this.applyWithWalker(new UnnecessaryLocalVariableRuleWalker(sourceFile, this.getOptions()));
    }
}

class UnnecessaryLocalVariableRuleWalker extends ErrorTolerantWalker {
    private readonly variableUsages: Map<ts.Identifier, tsutils.VariableInfo> = tsutils.collectVariableUsage(this.getSourceFile());

    protected visitBlock(node: ts.Block): void {
        this.validateStatementArray(node.statements);
        super.visitBlock(node);
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        this.validateStatementArray(node.statements);
        super.visitSourceFile(node);
    }

    protected visitCaseClause(node: ts.CaseClause): void {
        this.validateStatementArray(node.statements);
        super.visitCaseClause(node);
    }

    protected visitDefaultClause(node: ts.DefaultClause): void {
        this.validateStatementArray(node.statements);
        super.visitDefaultClause(node);
    }

    protected visitModuleDeclaration(node: ts.ModuleDeclaration): void {
        if (node.body != null && tsutils.isModuleBlock(node.body)) {
            this.validateStatementArray(node.body.statements);
        }
        super.visitModuleDeclaration(node);
    }

    private validateStatementArray(statements: ts.NodeArray<ts.Statement>): void {
        if (statements == null || statements.length < 2) {
            return; // one liners are always valid
        }

        const lastStatement = statements[statements.length - 1];
        const nextToLastStatement = statements[statements.length - 2];

        const returnedVariableName = this.tryToGetReturnedVariableName(lastStatement);
        const declaredVariableIdentifier = this.tryToGetDeclaredVariable(nextToLastStatement);
        if (declaredVariableIdentifier == null) {
            return;
        }

        const declaredVariableName: string = declaredVariableIdentifier.text;

        if (returnedVariableName != null
            && declaredVariableName != null
            && returnedVariableName === declaredVariableName
            && this.variableIsOnlyUsedOnce(declaredVariableIdentifier)) {
            this.addFailureAt(nextToLastStatement.getStart(), nextToLastStatement.getWidth(),
                FAILURE_STRING + returnedVariableName);
        }
    }

    private tryToGetDeclaredVariable(statement: ts.Statement): ts.Identifier | null {
        if (statement != null && tsutils.isVariableStatement(statement)) {
            if (statement.declarationList.declarations.length === 1) {
                const declaration: ts.VariableDeclaration = statement.declarationList.declarations[0];
                if (declaration.name != null && tsutils.isIdentifier(declaration.name)) {
                    return declaration.name;
                }
            }
        }
        return null;
    }

    private tryToGetReturnedVariableName(statement: ts.Statement): string | null {
        if (statement != null && tsutils.isReturnStatement(statement)) {
            if (statement.expression != null && tsutils.isIdentifier(statement.expression)) {
                return statement.expression.text;
            }
        }
        return null;
    }

    private variableIsOnlyUsedOnce(declaredVariableIdentifier: ts.Identifier) {
        const usage = this.variableUsages.get(declaredVariableIdentifier);

        return usage !== undefined && usage.uses.length === 1;
    }
}
