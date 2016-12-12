import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING_EXT: string = 'External module is being loaded from a relative path. Please use an absolute path: ';
const FAILURE_STRING_IMPORT: string = 'Imported module is being loaded from a relative path. Please use an absolute path: ';

/**
 * Implementation of the no-relative-imports rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-relative-imports',
        type: 'maintainability',
        description: 'Do not use relative paths when importing external modules or ES6 import declarations',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoRelativeImportsRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoRelativeImportsRuleWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.ExternalModuleReference) {
            const moduleExpression: ts.Expression = (<ts.ExternalModuleReference>node).expression;
            if (!this.isModuleExpressionValid(moduleExpression)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_EXT + node.getText()));
            }
        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            const moduleExpression: ts.Expression = (<ts.ImportDeclaration>node).moduleSpecifier;
            if (!this.isModuleExpressionValid(moduleExpression)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_IMPORT + node.getText()));
            }
        }
        super.visitNode(node);
    }

    private isModuleExpressionValid(expression: ts.Expression): boolean {
        if (expression.kind === ts.SyntaxKind.StringLiteral) {
            const moduleName: ts.StringLiteral = <ts.StringLiteral>expression;
            if (moduleName.text[0] === '.') {
                return false;
            }
        }
        return true;
    }
}
