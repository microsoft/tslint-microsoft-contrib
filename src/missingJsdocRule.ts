import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';

/**
 * Implementation of the missing-jsdoc rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'File missing JSDoc comment at the top-level: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingJSDocWalker(sourceFile, this.getOptions()));
    }
}

class MissingJSDocWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (!/^\/\*\*\s*$/gm.test(node.getFullText())) {
            const failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName;
            const failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
            this.addFailure(failure);
        }
        // do not continue walking
    }
}
