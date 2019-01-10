import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

interface Options {
    allowSiblings: boolean;
}

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
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        return {
            allowSiblings: options.ruleArguments.indexOf(OPTION_ALLOW_SIBLINGS) > -1
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { allowSiblings } = ctx.options;

    function getValidationErrorBody(expression: ts.Expression): string | undefined {
        if (tsutils.isStringLiteral(expression)) {
            const path = expression.text;

            // when no siblings allowed path cannot start with '.' (relative)
            if (!allowSiblings && path[0] === '.') {
                return FAILURE_BODY_RELATIVE;
            }

            // when siblings allowed path cannot start '..' (reference to parent directory)
            if (allowSiblings && path.indexOf('..') === 0) {
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

    function cb(node: ts.Node): void {
        if (tsutils.isExternalModuleReference(node)) {
            const errorBody = getValidationErrorBody(node.expression);
            if (errorBody !== undefined) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), `External ${errorBody}: ${node.getText()}`);
            }
        } else if (tsutils.isImportDeclaration(node)) {
            const errorBody = getValidationErrorBody(node.moduleSpecifier);
            if (errorBody !== undefined) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), `Imported ${errorBody}: ${node.getText()}`);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
