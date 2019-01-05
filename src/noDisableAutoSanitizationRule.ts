import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-disable-auto-sanitization',
        type: 'maintainability',
        description: 'Do not disable auto-sanitization of HTML because this opens up your page to an XSS attack. ',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '157, 159, 75, 79, 85, 749, 676'
    };

    public static FAILURE_STRING: string = 'Forbidden call to ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            const functionName: string = AstUtils.getFunctionName(node);
            if (functionName === 'execUnsafeLocalFunction' || functionName === 'setInnerHTMLUnsafe') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + functionName);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
