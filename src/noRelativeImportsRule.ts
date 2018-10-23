import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const OPTION_ALLOW_SIBLINGS = 'allow-siblings';

const FAILURE_STRING_EXT: string = 'External module is being loaded from a relative path. Please use an absolute path: ';
const FAILURE_STRING_IMPORT: string = 'Imported module is being loaded from a relative path. Please use an absolute path: ';
const FAILURE_STRING_EXT_SIBLINGS: string =
    'External module path starts with reference to parent directory. Please use an absolute path or sibling files/folders: ';
const FAILURE_STRING_IMPORT_SIBLINGS: string =
    'Imported module path starts with reference to parent directory. Please use an absolute path or sibling files/folders: ';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-relative-imports',
        type: 'maintainability',
        description: 'Do not use relative paths when importing external modules or ES6 import declarations',
        options: {
            type: 'array',
            items: {
              type: 'string',
              enum: [OPTION_ALLOW_SIBLINGS]
            },
            minLength: 0,
            maxLength: 1
          },
        optionsDescription: `One argument may be optionally provided: \n\n' +
            '* \`${OPTION_ALLOW_SIBLINGS}\` allows relative imports for files in the same or nested folders.`,
        typescriptOnly: false,
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
    private allowSiblings: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.allowSiblings = options.ruleArguments.indexOf(OPTION_ALLOW_SIBLINGS) > -1;
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.ExternalModuleReference) {
            const moduleExpression: ts.Expression = (<ts.ExternalModuleReference>node).expression;
            if (!this.isModuleExpressionValid(moduleExpression)) {
                const failureStart = this.allowSiblings ? FAILURE_STRING_EXT_SIBLINGS : FAILURE_STRING_EXT;
                this.addFailureAt(node.getStart(), node.getWidth(), failureStart + node.getText());
            }
        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            const moduleExpression: ts.Expression = (<ts.ImportDeclaration>node).moduleSpecifier;
            if (!this.isModuleExpressionValid(moduleExpression)) {
                const failureStart = this.allowSiblings ? FAILURE_STRING_IMPORT_SIBLINGS : FAILURE_STRING_IMPORT;
                this.addFailureAt(node.getStart(), node.getWidth(), failureStart + node.getText());
            }
        }
        super.visitNode(node);
    }

    private isModuleExpressionValid(expression: ts.Expression): boolean {
        if (expression.kind === ts.SyntaxKind.StringLiteral) {
            const moduleName: ts.StringLiteral = <ts.StringLiteral>expression;

            // when no siblings allowed path cannot start with '.' (relative)
            if (!this.allowSiblings && moduleName.text[0] === '.') {
                return false;
            }

            // when siblings allowed path cannot start '..' (reference to parrent directory)
            if (this.allowSiblings && moduleName.text.indexOf('..') === 0) {
                return false;
            }
        }
        return true;
    }
}
