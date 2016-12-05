import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-duplicate-case rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-duplicate-case',
        type: 'maintainability',
        description: 'Do not use duplicate case labels in switch statements.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Duplicate case found in switch statement: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateCaseRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoDuplicateCaseRuleWalker extends ErrorTolerantWalker {
    protected visitSwitchStatement(node: ts.SwitchStatement): void {
        const seenLabels: string[] = [];
        node.caseBlock.clauses.forEach((clauseOrDefault: ts.CaseOrDefaultClause): void => {
            if (clauseOrDefault.kind === ts.SyntaxKind.CaseClause) {
                const clause: ts.CaseClause = <ts.CaseClause>clauseOrDefault;
                if (clause.expression != null) {
                    const caseText = clause.expression.getText();
                    if (seenLabels.indexOf(caseText) > -1) {
                        this.addFailure(this.createFailure(clause.getStart(), clause.getWidth(), Rule.FAILURE_STRING + caseText));
                    } else {
                        seenLabels.push(caseText);
                    }
                }
            }
        });
        super.visitSwitchStatement(node);
    }

}
