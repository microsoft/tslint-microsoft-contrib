import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

interface Options {
    allowTypeParameters: boolean;
}
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'prefer-array-literal',
        type: 'maintainability',
        description: 'Use array literal syntax when declaring or instantiating array types.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static GENERICS_FAILURE_STRING: string = 'Replace generic-typed Array with array literal: ';
    public static CONSTRUCTOR_FAILURE_STRING: string = 'Replace Array constructor with an array literal: ';
    public static FUNCTION_FAILURE_STRING: string = 'Replace Array function with an array literal: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        let value: boolean = false;
        let ruleOptions: any[] = [];

        if (options.ruleArguments instanceof Array) {
            ruleOptions = options.ruleArguments;
        }

        if (options instanceof Array) {
            ruleOptions = options;
        }

        ruleOptions.forEach((opt: unknown) => {
            if (isObject(opt)) {
                value = opt['allow-type-parameters'] === true;
            }
        });

        return {
            allowTypeParameters: value
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { allowTypeParameters } = ctx.options;

    function cb(node: ts.Node): void {
        if (tsutils.isTypeReferenceNode(node)) {
            if (!allowTypeParameters) {
                if ((<ts.Identifier>node.typeName).text === 'Array') {
                    const failureString = Rule.GENERICS_FAILURE_STRING + node.getText();
                    ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
                }
            }
        }

        if (tsutils.isNewExpression(node)) {
            const functionName = AstUtils.getFunctionName(node);
            if (functionName === 'Array') {
                const failureString = Rule.CONSTRUCTOR_FAILURE_STRING + node.getText();
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }

        if (tsutils.isCallExpression(node)) {
            const expr = node.expression;
            if (expr.getText() === 'Array') {
                const failureString = Rule.FUNCTION_FAILURE_STRING + node.getText();
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
