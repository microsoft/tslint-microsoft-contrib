import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Found as-cast instead of a traditional type-cast. Please convert to a type-cast: ';

/**
 * Implementation of the prefer-type-cast rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'prefer-type-cast',
        type: 'maintainability',
        description: 'Prefer the tradition type casts instead of the new \'as-cast\' syntax',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Configurable',
        recommendation: 'true,   // pick either type-cast format and use it consistently',
        commonWeaknessEnumeration: '398, 710'
    };

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: prefer-type-cast rule is deprecated. Replace your usage with the TSLint no-angle-bracket-type-assertion rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new PreferTypeCastRuleWalker(sourceFile, this.getOptions()));
    }
}

class PreferTypeCastRuleWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (/.*\.tsx/.test(node.fileName) === false) {
            super.visitSourceFile(node);
        }
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.AsExpression) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
        }
        super.visitNode(node);
    }
}
