module.exports = ({ ruleName, walkerName, type, description, issueClass, issueType, severity, level, group }) =>
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
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        optionExamples: [], // TODO: Remove this property if the rule has no options
        typescriptOnly: false,
        issueClass: '${issueClass}',
        issueType: '${issueType}',
        severity: '${severity}',
        level: '${level}',
        group: '${group}',
        commonWeaknessEnumeration: '...' // if possible, please map your rule to a CWE (see cwe_descriptions.json and https://cwe.mitre.org)
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ${walkerName}(sourceFile, this.getOptions()));
    }
}

class ${walkerName} extends Lint.RuleWalker {
    protected visitNode(node: ts.Node): void {
        super.visitNode(node);
    }
}
`;
