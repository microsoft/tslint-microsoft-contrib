import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

interface Options {
    checkLoops: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-constant-condition',
        type: 'maintainability',
        description: 'Do not use constant expressions in conditions.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 570, 571, 670'
    };

    public static FAILURE_STRING: string = 'Found constant conditional: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.getOptions()));
    }
}

function parseOptions(options: Lint.IOptions): Options {
    let value = true;
    const keyName = 'checkLoops';

    (options.ruleArguments || []).forEach((opt: unknown) => {
        if (isObject(opt)) {
            if (opt[keyName] === false || opt[keyName] === 'false') {
                value = false;
            }
        }
    });

    return {
        checkLoops: value
    };
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { checkLoops } = ctx.options;

    function cb(node: ts.Node): void {
        if (checkLoops && (tsutils.isWhileStatement(node) || tsutils.isDoStatement(node))) {
            if (AstUtils.isConstantExpression(node.expression)) {
                const message: string = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
                ctx.addFailureAt(node.getStart(), node.getWidth(), message);
            }
        }

        if (tsutils.isIfStatement(node)) {
            if (AstUtils.isConstantExpression(node.expression)) {
                const message: string = Rule.FAILURE_STRING + 'if (' + node.expression.getText() + ')';
                ctx.addFailureAt(node.getStart(), node.getWidth(), message);
            }
        }

        if (tsutils.isConditionalExpression(node)) {
            if (AstUtils.isConstantExpression(node.condition)) {
                const message: string = Rule.FAILURE_STRING + node.condition.getText() + ' ?';
                ctx.addFailureAt(node.getStart(), node.getWidth(), message);
            }
        }

        if (tsutils.isForStatement(node)) {
            if (checkLoops && node.condition) {
                if (AstUtils.isConstantExpression(node.condition)) {
                    const message: string = Rule.FAILURE_STRING + ';' + node.condition.getText() + ';';
                    ctx.addFailureAt(node.getStart(), node.getWidth(), message);
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
