import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-duplicate-case',
        type: 'maintainability',
        description: 'Do not use duplicate case labels in switch statements.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        recommendation: 'false',
        group: 'Deprecated',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Duplicate case found in switch statement: ';

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn(
                'Warning: no-duplicate-case rule is deprecated. Replace your usage with the TSLint no-duplicate-switch-case rule.'
            );
            Rule.isWarningShown = true;
        }
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isSwitchStatement(node)) {
            const seenLabels: string[] = [];
            node.caseBlock.clauses.forEach(
                (clauseOrDefault: ts.CaseOrDefaultClause): void => {
                    if (tsutils.isCaseClause(clauseOrDefault)) {
                        const clause: ts.CaseClause = <ts.CaseClause>clauseOrDefault;
                        if (clause.expression) {
                            const caseText = clause.expression.getText();
                            if (seenLabels.indexOf(caseText) > -1) {
                                ctx.addFailureAt(clause.getStart(), clause.getWidth(), Rule.FAILURE_STRING + caseText);
                            } else {
                                seenLabels.push(caseText);
                            }
                        }
                    }
                }
            );
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
