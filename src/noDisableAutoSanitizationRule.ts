import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';

/**
 * Implementation of the no-disable-auto-sanitization rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden call to ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDisableAutoSanitizationWalker(sourceFile, this.getOptions()));
    }
}

class NoDisableAutoSanitizationWalker extends ErrorTolerantWalker {
    protected visitCallExpression(node: ts.CallExpression): void {
        const functionName : string = AstUtils.getFunctionName(node);
        if (functionName === 'execUnsafeLocalFunction' || functionName === 'setInnerHTMLUnsafe') {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + functionName));
        }
        super.visitCallExpression(node);
    }
}
