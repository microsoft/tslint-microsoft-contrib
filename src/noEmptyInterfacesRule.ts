import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-empty-interfaces rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-empty-interfaces',
        type: 'maintainability',
        description: 'Do not use empty interfaces.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false, // use tslint no-empty-interface rule instead',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Do not declare empty interfaces: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEmptyInterfacesRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoEmptyInterfacesRuleWalker extends ErrorTolerantWalker {
    protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        // do we have an empty interface?
        if (this.isInterfaceEmpty(node) && !this.hasMultipleParents(node)) {
            this.addFailure(
                this.createFailure(
                    node.getStart(), node.getWidth(), Rule.FAILURE_STRING + '\'' + node.name.getText() + '\''
                    )
            );
        }
        super.visitInterfaceDeclaration(node);
    }

    private isInterfaceEmpty(node: ts.InterfaceDeclaration): boolean {
        return node.members == null || node.members.length === 0;
    }

    private hasMultipleParents(node: ts.InterfaceDeclaration): boolean {
        if (node.heritageClauses == null || node.heritageClauses.length === 0) {
            return false;
        }
        return node.heritageClauses[0].types.length >= 2;
    }
}
