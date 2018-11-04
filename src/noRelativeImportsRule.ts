import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const OPTION_ALLOW_SIBLINGS = 'allow-siblings';

const FAILURE_BODY_RELATIVE: string = 'module is being loaded from a relative path. Please use an absolute path';
const FAILURE_BODY_SIBLINGS: string =
    'module path starts with reference to parent directory. Please use an absolute path or sibling files/folders';
const FAILURE_BODY_INSIDE: string = 'module path should not contain reference to current or parent directory inside';

// Looks for path separator `/` or `\\`(Windows style)
// followed than one or two dot characters
// followed by path separator (same as initial).
const illegalInsideRegex = /(\/|\\)\.\.?\1/;

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

class NoRelativeImportsRuleWalker extends Lint.RuleWalker {
    private readonly allowSiblings: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.allowSiblings = options.ruleArguments.indexOf(OPTION_ALLOW_SIBLINGS) > -1;
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.ExternalModuleReference) {
            const moduleExpression: ts.Expression = (<ts.ExternalModuleReference>node).expression;
            const errorBody = this.getValidationErrorBody(moduleExpression);
            if (errorBody !== undefined) {
                this.addFailureAt(node.getStart(), node.getWidth(), `External ${errorBody}: ${node.getText()}`);
            }
        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            const moduleExpression: ts.Expression = (<ts.ImportDeclaration>node).moduleSpecifier;
            const errorBody = this.getValidationErrorBody(moduleExpression);
            if (errorBody !== undefined) {
                this.addFailureAt(node.getStart(), node.getWidth(), `Imported ${errorBody}: ${node.getText()}`);
            }
        }
        super.visitNode(node);
    }

    private getValidationErrorBody(expression: ts.Expression): string | undefined {
        if (expression.kind === ts.SyntaxKind.StringLiteral) {
            const moduleName: ts.StringLiteral = <ts.StringLiteral>expression;
            const path = moduleName.text;

            // when no siblings allowed path cannot start with '.' (relative)
            if (!this.allowSiblings && path[0] === '.') {
                return FAILURE_BODY_RELATIVE;
            }

            // when siblings allowed path cannot start '..' (reference to parent directory)
            if (this.allowSiblings && path.indexOf('..') === 0) {
                return FAILURE_BODY_SIBLINGS;
            }

            // '/../' and '/./' are always disallowed in the middle of module path
            if (illegalInsideRegex.test(path)) {
                return FAILURE_BODY_INSIDE;
            }
        }

        // explicitly return undefined when path is valid or not a literal
        return undefined;
    }
}
