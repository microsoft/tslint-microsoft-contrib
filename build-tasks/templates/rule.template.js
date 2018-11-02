module.exports = ({ ruleName, walkerName }) =>
    `import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {AstUtils} from './utils/AstUtils';
import {Utils} from './utils/Utils';

const FAILURE_STRING: string = 'Some error message: '; // TODO: Define an error message

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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new %WALKER_NAME%(sourceFile, this.getOptions()));
    }
}

class ${walkerName} extends Lint.RuleWalker {

    protected visitNode(node: ts.Node): void {
        console.log(ts.SyntaxKind[node.kind] + ' ' + node.getText());
        super.visitNode(node);
    }
}
`;
