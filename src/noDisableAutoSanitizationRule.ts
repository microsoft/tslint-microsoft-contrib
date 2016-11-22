import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-disable-auto-sanitization rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-disable-auto-sanitization',
        type: 'maintainability',
        description: 'Do not disable auto-sanitization of HTML because this opens up your page to an XSS attack. ',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '157, 159, 75, 79, 85, 749, 676'
    };

    public static FAILURE_STRING = 'Forbidden call to ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDisableAutoSanitizationWalker(sourceFile, this.getOptions()));
    }
}

class NoDisableAutoSanitizationWalker extends ErrorTolerantWalker {
    protected visitCallExpression(node: ts.CallExpression): void {
        const functionName : string = AstUtils.getFunctionName(node);
        if (functionName === 'execUnsafeLocalFunction' || functionName === 'setInnerHTMLUnsafe') {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + functionName));
        }
        super.visitCallExpression(node);
    }
}
