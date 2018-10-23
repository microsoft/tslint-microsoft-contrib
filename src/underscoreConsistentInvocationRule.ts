import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

const FAILURE_STATIC_FOUND: string = 'Static invocation of underscore function found. Prefer instance version instead: ';
const FAILURE_INSTANCE_FOUND: string = 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: ';

const FUNCTION_NAMES: string[] = [
    'each', 'forEach', 'map', 'collect',
    'reduce', 'inject', 'foldl', 'reduceRight',
    'foldr', 'find', 'detect', 'filter',
    'select', 'where', 'findWhere', 'reject',
    'every', 'all', 'some', 'any',
    'contains', 'include', 'invoke', 'pluck',
    'max', 'min', 'sortBy', 'groupBy',
    'indexBy', 'countBy', 'shuffle', 'sample',
    'toArray', 'size', 'partition', 'first',
    'head', 'take', 'initial', 'last',
    'rest', 'tail', 'drop', 'compact',
    'flatten', 'without', 'union', 'intersection',
    'difference', 'uniq', 'unique', 'object',
    'zip', 'unzip', 'indexOf', 'findIndex',
    'lastIndexOf', 'findLastIndex', 'sortedIndex', 'range'
];

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'underscore-consistent-invocation',
        type: 'maintainability',
        description: 'Enforce a consistent usage of the _ functions',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UnderscoreConsistentInvocationRuleWalker(sourceFile, this.getOptions()));
    }
}

class UnderscoreConsistentInvocationRuleWalker extends ErrorTolerantWalker {

    private style: string = 'instance';

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.getOptions().forEach((opt: unknown) => {
            if (isObject(opt)) {
                if (opt.style === 'static') {
                    this.style = 'static';
                }
            }
        });
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        const functionName: string = AstUtils.getFunctionName(node);

        if (this.style === 'instance' && this.isStaticUnderscoreInvocation(node)) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STATIC_FOUND + '_.' + functionName);
        }
        if (this.style === 'static' && this.isStaticUnderscoreInstanceInvocation(node)) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_INSTANCE_FOUND + node.expression.getText());
        }
        super.visitCallExpression(node);
    }

    private isStaticUnderscoreInstanceInvocation(node: ts.CallExpression) {
        if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propExpression: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.expression;
            if (propExpression.expression.kind === ts.SyntaxKind.CallExpression) {
                const call: ts.CallExpression = <ts.CallExpression>propExpression.expression;
                const target = AstUtils.getFunctionTarget(call);
                const functionName = AstUtils.getFunctionName(call);
                if (target === undefined && functionName === '_' && call.arguments.length === 1) {
                    const underscoreFunctionName = AstUtils.getFunctionName(node);
                    return FUNCTION_NAMES.indexOf(underscoreFunctionName) > -1;
                }
            }
        }
        return false;
    }

    private isStaticUnderscoreInvocation(node: ts.CallExpression) {
        const target = AstUtils.getFunctionTarget(node);
        if (target !== '_') {
            return false;
        }
        const functionName: string = AstUtils.getFunctionName(node);
        return FUNCTION_NAMES.indexOf(functionName) > -1;
    }
}
