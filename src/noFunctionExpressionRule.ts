import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-function-expression',
        type: 'maintainability',
        description: 'Do not use function expressions; use arrow functions (lambdas) instead.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Use arrow function instead of function expression';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    const allowGenericFunctionExpression = AstUtils.getLanguageVariant(ctx.sourceFile) === ts.LanguageVariant.JSX;

    function cb(node: ts.Node): void {
        if (tsutils.isFunctionExpression(node)) {
            const walker = new SingleFunctionWalker();
            node.getChildren().forEach((child: ts.Node) => {
                walker.walk(child);
            });

            const isGenericFunctionInTSX = allowGenericFunctionExpression && walker.isGenericFunction;
            // function expression that access 'this' is allowed
            if (
                !walker.isAccessingThis &&
                !node.asteriskToken &&
                // generic function expression in .tsx file is allowed
                !isGenericFunctionInTSX
            ) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}

class SingleFunctionWalker {
    public isAccessingThis: boolean = false;
    public isGenericFunction: boolean = false;

    public walk(root: ts.Node) {
        const cb = (node: ts.Node) => {
            if (node.getText() === 'this') {
                this.isAccessingThis = true;
            }

            if (tsutils.isFunctionExpression(node) || tsutils.isArrowFunction(node)) {
                // do not visit inner blocks
                return;
            }

            if (tsutils.isTypeReferenceNode(node)) {
                this.isGenericFunction = true;
            }

            ts.forEachChild(node, cb);
        };

        cb(root);
    }
}
