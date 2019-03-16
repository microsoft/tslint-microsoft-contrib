import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-missing-visibility-modifiers',
        type: 'maintainability',
        description: 'Deprecated - This rule is in the TSLint product as `member-access`',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function isMissingVisibilityModifier(node: ts.Declaration): boolean {
        return !(AstUtils.isPrivate(node) || AstUtils.isProtected(node) || AstUtils.isPublic(node));
    }

    function getFailureCodeSnippet(node: ts.Node) {
        const message: string = node.getText();
        if (message.indexOf('\n') > 0) {
            return message.substr(0, message.indexOf('\n'));
        }
        return message;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isPropertyDeclaration(node)) {
            if (isMissingVisibilityModifier(node)) {
                const failureString = 'Field missing visibility modifier: ' + getFailureCodeSnippet(node);
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }

        if (tsutils.isMethodDeclaration(node)) {
            if (isMissingVisibilityModifier(node)) {
                const failureString = 'Method missing visibility modifier: ' + getFailureCodeSnippet(node);
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
