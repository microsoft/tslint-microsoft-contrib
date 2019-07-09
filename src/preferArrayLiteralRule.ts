import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

// undefined for case when function/constructor is called directly without namespace
const RESTRICTED_NAMESPACES: Set<string | undefined> = new Set([undefined, 'window', 'self', 'global', 'globalThis']);

function inRestrictedNamespace(node: ts.NewExpression | ts.CallExpression): boolean {
    const functionTarget = AstUtils.getFunctionTarget(node);
    return RESTRICTED_NAMESPACES.has(functionTarget);
}

type InvocationType = 'constructor' | 'function';

interface Options {
    allowSizeArgument: boolean;
    allowTypeParameters: boolean;
}

export class Rule extends Lint.Rules.OptionallyTypedRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'prefer-array-literal',
        type: 'maintainability',
        description: 'Use array literal syntax when declaring or instantiating array types.',
        options: {
            type: 'object',
            properties: {
                'allow-size-argument': {
                    type: 'boolean'
                },
                'allow-type-parameters': {
                    type: 'boolean'
                }
            },
            additionalProperties: false
        },
        optionsDescription: Lint.Utils.dedent`
            Rule accepts object with next boolean options:

            - "allow-size-argument" - allows calls to Array constructor with a single element (to create empty array of a given length).
            - "allow-type-parameters" - allow Array type parameters.
        `,
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static GENERICS_FAILURE_STRING: string = 'Replace generic-typed Array with array literal.';
    public static getReplaceFailureString = (type: InvocationType) => `Replace Array ${type} with an array literal.`;
    public static getSizeParamFailureString = (type: InvocationType) =>
        `To create an array of a given length you should use non-negative integer. Otherwise replace Array ${type} with an array literal.`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithProgram(sourceFile, /* program */ undefined);
    }
    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program | undefined): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            this.parseOptions(this.getOptions()),
            program ? program.getTypeChecker() : undefined
        );
    }

    private parseOptions(options: Lint.IOptions): Options {
        let allowSizeArgument: boolean = false;
        let allowTypeParameters: boolean = false;
        let ruleOptions: any[] = [];

        if (options.ruleArguments instanceof Array) {
            ruleOptions = options.ruleArguments;
        }

        if (options instanceof Array) {
            ruleOptions = options;
        }

        ruleOptions.forEach((opt: unknown) => {
            if (isObject(opt)) {
                allowSizeArgument = opt['allow-size-argument'] === true;
                allowTypeParameters = opt['allow-type-parameters'] === true;
            }
        });

        return {
            allowSizeArgument,
            allowTypeParameters
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker | undefined) {
    const { allowTypeParameters, allowSizeArgument } = ctx.options;
    function checkExpression(type: InvocationType, node: ts.CallExpression | ts.NewExpression): void {
        const functionName = AstUtils.getFunctionName(node);
        if (functionName === 'Array' && inRestrictedNamespace(node)) {
            const callArguments = node.arguments;
            if (!allowSizeArgument || !callArguments || callArguments.length !== 1) {
                const failureString = Rule.getReplaceFailureString(type);
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            } else {
                // When typechecker is not available - allow any call with single expression
                if (checker) {
                    try {
                        // TS might throw exceptions in non-standard conditions (like .vue files)
                        // Use try...catch blocks to fallback to the same behavior as when checker is not available
                        // See https://github.com/microsoft/tslint-microsoft-contrib/issues/859
                        const argument = callArguments[0];
                        const argumentType = checker.getTypeAtLocation(argument);
                        // Looks like TS returns type or array elements when SpreadElement is passed to getTypeAtLocation.
                        // Additional check for SpreadElement is required to catch case when array has type number[] and its element will pass assignability check.
                        // SpreadElement shouldn't be allowed because result of `Array(...arr)` call will dependepend on array lenght and might produce unexpected results.
                        if (!tsutils.isTypeAssignableToNumber(checker, argumentType) || argument.kind === ts.SyntaxKind.SpreadElement) {
                            const failureString = Rule.getSizeParamFailureString(type);
                            ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
                        }
                    } catch {
                        // No error to use same behavior as when typeChecker is not available
                    }
                }
            }
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isTypeReferenceNode(node)) {
            if (!allowTypeParameters) {
                if ((<ts.Identifier>node.typeName).text === 'Array') {
                    const failureString = Rule.GENERICS_FAILURE_STRING;
                    ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
                }
            }
        }

        if (tsutils.isNewExpression(node)) {
            checkExpression('constructor', node);
        }

        if (tsutils.isCallExpression(node)) {
            checkExpression('function', node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
