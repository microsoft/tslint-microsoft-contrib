import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the no-duplicate-case rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Duplicate case found in switch statement: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateCaseRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoDuplicateCaseRuleWalker extends ErrorTolerantWalker {


    protected visitSwitchStatement(node: ts.SwitchStatement): void {
        var seenLabels: string[] = [];
        node.caseBlock.clauses.forEach((clauseOrDefault: ts.CaseOrDefaultClause): void => {
            if (clauseOrDefault.kind === SyntaxKind.current().CaseClause) {
                let clause: ts.CaseClause = <ts.CaseClause>clauseOrDefault;
                if (clause.expression != null) {
                    let caseText = clause.expression.getText();
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
