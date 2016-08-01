import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {AstUtils} from './utils/AstUtils';

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

/**
 * Implementation of the underscore-consistent-invocation rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UnderscoreConsistentInvocationRuleWalker(sourceFile, this.getOptions()));
    }
}

class UnderscoreConsistentInvocationRuleWalker extends ErrorTolerantWalker {

    private style: string = 'instance';

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                if (opt.style === 'static') {
                    this.style = 'static';
                }
            }
        });
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        const functionName: string = AstUtils.getFunctionName(node);

        if (this.style === 'instance' && this.isStaticUnderscoreInvocation(node)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STATIC_FOUND + '_.' + functionName));
        }
        if (this.style === 'static' && this.isStaticUnderscoreInstanceInvocation(node)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_INSTANCE_FOUND + node.expression.getText()));
        }
        super.visitCallExpression(node);
    }

    private isStaticUnderscoreInstanceInvocation(node: ts.CallExpression) {
        if (node.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
            const propExpression: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.expression;
            if (propExpression.expression.kind === SyntaxKind.current().CallExpression) {
                const call: ts.CallExpression = <ts.CallExpression>propExpression.expression;
                const target: string = AstUtils.getFunctionTarget(call);
                const functionName: string = AstUtils.getFunctionName(call);
                if (target == null && functionName === '_' && call.arguments.length === 1) {
                    const underscoreFunctionName = AstUtils.getFunctionName(node);
                    return FUNCTION_NAMES.indexOf(underscoreFunctionName) > -1;
                }
            }
        }
        return false;
    }

    private isStaticUnderscoreInvocation(node: ts.CallExpression) {
        const target: string = AstUtils.getFunctionTarget(node);
        if (target !== '_') {
            return false;
        }
        const functionName: string = AstUtils.getFunctionName(node);
        return FUNCTION_NAMES.indexOf(functionName) > -1;
    }
}
