import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

const FAILURE_STRING: string = 'No var self = this';

/**
 * Implementation of the no-var-self rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoVarSelfRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoVarSelfRuleWalker extends Lint.RuleWalker {
    protected visitVariableStatement(node: ts.VariableStatement): void {
        const failures: any[] = [];
        node.declarationList.declarations
            .filter(declaration => declaration.getText().replace(/\s+/g, '') === 'self=this')
            .forEach(declaration => {
                failures.push(declaration.getText().replace(/\s+/g, ''));
                this.addFailure(
                    this.createFailure(
                        declaration.getStart(),
                        declaration.getWidth(),
                        FAILURE_STRING));
            });

        // throw new Error("Failures: |" + failures.join(". .") + "|");
    }
}
