import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-function-constructor-with-string-args rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-function-constructor-with-string-args',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Do not use the version of the Function constructor that accepts a string argument to define the body of the function',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676, 242, 116'
    };

    public static FAILURE_STRING: string = 'forbidden: Function constructor with string arguments ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFunctionConstructorWithStringArgsWalker(sourceFile, this.getOptions()));
    }
}

class NoFunctionConstructorWithStringArgsWalker extends ErrorTolerantWalker {
    public constructor(sourceFile : ts.SourceFile, options : Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitNewExpression(node: ts.NewExpression): void {
        const functionName  = AstUtils.getFunctionName(node);
        if (functionName === 'Function') {
            if (node.arguments.length > 0) {
                this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
            }
        }
        super.visitNewExpression(node);
    }
}
