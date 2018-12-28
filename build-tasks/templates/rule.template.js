module.exports = ({ ruleName, type, description, typescriptOnly, issueClass, issueType, severity, level, group }) =>
    `import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { AstUtils } from './utils/AstUtils';
import { Utils } from './utils/Utils';

const FAILURE_STRING: string = 'Some error message: '; // TODO: Define an error message

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: '${ruleName}',
        type: '${type}',
        description: '${description}',
        // TODO: Fill in the options and options description, or leave them as they are if there are no options.
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        optionExamples: [], // TODO: Remove this property if the rule has no options
        typescriptOnly: ${typescriptOnly},
        issueClass: '${issueClass}',
        issueType: '${issueType}',
        severity: '${severity}',
        level: '${level}',
        group: '${group}',
        commonWeaknessEnumeration: '...' // if possible, please map your rule to a CWE (see cwe_descriptions.json and https://cwe.mitre.org)
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        // TODO: Implement the rule here.
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
`;
