import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Assigning this reference to local variable: ';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-var-self',
        type: 'maintainability',
        description: 'Do not use var self = this; instead, manage scope with arrow functions/lambdas.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false,',
        commonWeaknessEnumeration: '398, 710'
    };

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-var-self rule is deprecated. Replace your usage with the TSLint no-this-assignment rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new NoVarSelfRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoVarSelfRuleWalker extends Lint.RuleWalker {

    private bannedVariableNames: RegExp = /.*/; // default is to ban everything

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        if (options.ruleArguments !== undefined && options.ruleArguments.length > 0) {
            this.bannedVariableNames = new RegExp(options.ruleArguments[0]);
        }
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (node.initializer !== undefined && node.initializer.kind === ts.SyntaxKind.ThisKeyword) {
            if (node.name.kind === ts.SyntaxKind.Identifier) {
                const identifier: ts.Identifier = <ts.Identifier>node.name;
                if (this.bannedVariableNames.test(identifier.text)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
                }
            }
        }
        super.visitVariableDeclaration(node);
    }
}
