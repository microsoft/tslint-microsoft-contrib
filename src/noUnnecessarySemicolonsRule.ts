import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING: string = 'unnecessary semi-colon';

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-semicolons',
        type: 'maintainability',
        description: 'Remove unnecessary semicolons',
        options: undefined,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Whitespace',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnnecessarySemicolonsWalker(sourceFile, this.getOptions()));
    }
}

class NoUnnecessarySemicolonsWalker extends ErrorTolerantWalker {

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.EmptyStatement) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
        super.visitNode(node);
    }

    protected visitForStatement(node: ts.ForStatement): void {
        if (node.statement.kind === ts.SyntaxKind.EmptyStatement) {
            // walk everything but the statement
            if (node.initializer) {
                this.visitNode(node.initializer);
            }
            if (node.condition) {
                this.visitNode(node.condition);
            }
            if (node.incrementor) {
                this.visitNode(node.incrementor);
            }
        } else {
            super.visitForStatement(node);
        }
    }

    protected visitWhileStatement(node: ts.WhileStatement): void {
        if (node.statement.kind === ts.SyntaxKind.EmptyStatement) {
            // walk the expression but not the empty statement
            this.visitNode(node.expression);
        } else {
            super.visitWhileStatement(node);
        }
    }
}
