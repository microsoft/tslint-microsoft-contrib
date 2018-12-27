import * as ts from 'typescript';
import * as Lint from 'tslint';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-function-constructor-with-string-args',
        type: 'maintainability',
        description: 'Do not use the version of the Function constructor that accepts a string argument to define the body of the function',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        recommendation: 'false, // use tslint function-constructor rule intsead',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676, 242, 116'
    };

    public static FAILURE_STRING: string = 'forbidden: Function constructor with string arguments ';

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn(
                'Warning: no-function-constructor-with-string-args rule is deprecated. Replace your usage with the TSLint function-constructor rule.'
            );
            Rule.isWarningShown = true;
        }

        return this.applyWithWalker(new NoFunctionConstructorWithStringArgsWalker(sourceFile, this.getOptions()));
    }
}

class NoFunctionConstructorWithStringArgsWalker extends Lint.RuleWalker {
    public constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitNewExpression(node: ts.NewExpression): void {
        const functionName = AstUtils.getFunctionName(node);
        if (functionName === 'Function' && node.arguments !== undefined && node.arguments.length > 0) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
        super.visitNewExpression(node);
    }
}
