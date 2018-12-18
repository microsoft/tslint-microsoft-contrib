module.exports = ({ ruleName, walkerName }) =>
    `import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: '${ruleName}',
        type: 'maintainability',    // one of: 'functionality' | 'maintainability' | 'style' | 'typescript'
        description: '... add a meaningful one line description',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        optionExamples: [],         // Remove this property if the rule has no options
        typescriptOnly: false,
        issueClass: 'Non-SDL',      // one of: 'SDL' | 'Non-SDL' | 'Ignored'
        issueType: 'Warning',       // one of: 'Error' | 'Warning'
        severity: 'Low',            // one of: 'Critical' | 'Important' | 'Moderate' | 'Low'
        level: 'Opportunity for Excellence',  // one of 'Mandatory' | 'Opportunity for Excellence'
        group: 'Clarity',           // one of 'Ignored' | 'Security' | 'Correctness' | 'Clarity' | 'Whitespace' | 'Configurable' | 'Deprecated'
        commonWeaknessEnumeration: '...'   // if possible, please map your rule to a CWE (see cwe_descriptions.json and https://cwe.mitre.org)
    };

    public static FAILURE_STRING: string = 'Some error message: '; // Define an error message

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        const failingExpressionCondition = true; //Customize condition to rule.
        if (failingExpressionCondition) {
            const msg: string = Rule.FAILURE_STRING;
            ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
`;
