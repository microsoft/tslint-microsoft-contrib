import * as ts from 'typescript';
import {RuleWalker, Rules, RuleFailure, IOptions } from 'tslint/lib/lint';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Assigning this reference to local variable: ';

/**
 * Implementation of the no-var-self rule.
 */
export class Rule extends Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-var-self',
        type: 'maintainability',
        description: 'Do not use var self = this; instead, manage scope with arrow functions/lambdas.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new NoVarSelfRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoVarSelfRuleWalker extends RuleWalker {

    private bannedVariableNames: RegExp = /.*/; // default is to ban everything

    constructor(sourceFile: ts.SourceFile, options: IOptions) {
        super(sourceFile, options);
        if (options.ruleArguments != null && options.ruleArguments.length > 0) {
            this.bannedVariableNames = new RegExp(options.ruleArguments[0]);
        }
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (node.initializer != null && node.initializer.kind === SyntaxKind.current().ThisKeyword) {
            if (node.name.kind === SyntaxKind.current().Identifier) {
                const identifier: ts.Identifier = <ts.Identifier>node.name;
                if (this.bannedVariableNames.test(identifier.text)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
                }
            }
        }
        super.visitVariableDeclaration(node);
    }
}
