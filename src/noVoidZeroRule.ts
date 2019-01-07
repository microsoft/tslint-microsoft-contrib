import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Replace void 0 with undefined';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-void-zero',
        type: 'maintainability',
        description: 'Avoid using void 0, prefer undefined',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '480'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isVoidExpression(node)) {
            if (node.expression !== undefined && node.expression.getText() === '0') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
            }
        }
        if (
            tsutils.isMethodDeclaration(node) ||
            tsutils.isConstructorDeclaration(node) ||
            tsutils.isArrowFunction(node) ||
            tsutils.isFunctionDeclaration(node) ||
            tsutils.isFunctionExpression(node)
        ) {
            node.parameters.forEach(
                (parameter: ts.ParameterDeclaration): void => {
                    const parameterName: string = parameter.name.getText();
                    if (parameterName === '') {
                        const sourceFile: ts.SourceFile = ctx.sourceFile;
                        const isVoidZeroInText: boolean = sourceFile.getText().indexOf('void 0') !== -1;
                        if (isVoidZeroInText) {
                            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
                        }
                    }
                }
            );
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
