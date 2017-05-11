import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

import {AstUtils} from './utils/AstUtils';

/**
 * Implementation of the no-exec-script rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-exec-script',
        type: 'maintainability',
        description: 'Do not use the execScript functions',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676'
    };

    public static FAILURE_STRING: string = 'forbidden execScript: ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEvalScriptWalker(sourceFile, this.getOptions()));
    }
}

class NoEvalScriptWalker extends ErrorTolerantWalker {
    protected visitCallExpression(node: ts.CallExpression) {
        this.validateExpression(node);
        super.visitCallExpression(node);
    }

    private validateExpression(node : ts.CallExpression) : void {
        const expression: ts.Expression = node.expression;
        const functionName : string = AstUtils.getFunctionName(node);
        if (functionName === 'execScript') {
            const msg : string = Rule.FAILURE_STRING + expression.getFullText().trim();
            this.addFailureAt(expression.getStart(), expression.getWidth(), msg);
        }
    }
}
