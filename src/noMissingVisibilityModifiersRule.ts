import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the mo-missing-visibility-modifiers rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-missing-visibility-modifiers',
        type: 'maintainability',
        description: 'Deprecated - This rule is in the TSLint product as `member-access`',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false, // use tslint member-access rule instead',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingVisibilityModifierWalker(sourceFile, this.getOptions()));
    }
}

class MissingVisibilityModifierWalker extends ErrorTolerantWalker {
    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        if (this.isMissingVisibilityModifier(node)) {
            const failureString = 'Field missing visibility modifier: ' + this.getFailureCodeSnippet(node);
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
        super.visitPropertyDeclaration(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (this.isMissingVisibilityModifier(node)) {
            const failureString = 'Method missing visibility modifier: ' + this.getFailureCodeSnippet(node);
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
        super.visitMethodDeclaration(node);
    }

    private isMissingVisibilityModifier(node: ts.Node) : boolean {
        return !(AstUtils.isPrivate(node) || AstUtils.isProtected(node) || AstUtils.isPublic(node));
    }

    private getFailureCodeSnippet(node: ts.Node) {
        const message: string = node.getText();
        if (message.indexOf('\n') > 0) {
            return message.substr(0, message.indexOf('\n'));
        }
        return message;
    }
}
