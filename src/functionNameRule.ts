import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const METHOD_REGEX = 'method-regex';
const PRIVATE_METHOD_REGEX = 'private-method-regex';
const PROTECTED_METHOD_REGEX = 'protected-method-regex';
const STATIC_METHOD_REGEX = 'static-method-regex';
const FUNCTION_REGEX = 'function-regex';

const VALIDATE_PRIVATE_STATICS_AS_PRIVATE = 'validate-private-statics-as-private';
const VALIDATE_PRIVATE_STATICS_AS_STATIC = 'validate-private-statics-as-static';
const VALIDATE_PRIVATE_STATICS_AS_EITHER = 'validate-private-statics-as-either';
const NOT_VALID_ARG = 'none';

const VALID_ARGS = [VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER];

function parseOptions(ruleArguments: any[]): Options {

    if (ruleArguments.length === 0) {
        return {
            validateStatics: NOT_VALID_ARG
        };
    }
    const staticsValidateOption: string = ruleArguments[1];
    if (VALID_ARGS.indexOf(staticsValidateOption) > -1) {
        return {
            validateStatics: staticsValidateOption
        };
    } else {
        return {
            validateStatics: NOT_VALID_ARG
        };
    }
}

interface Options {
    readonly validateStatics: string;
}

/**
 * Implementation of the function-name rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'function-name',
        type: 'maintainability',
        description: 'Applies a naming convention to function names and method names',
        optionsDescription: Lint.Utils.dedent`
            Function styles should be consistent throughout the code.
            Users may want functions with multiple descriptors to be validated a certain way.
            An optional argument specifies validation for private static methods:
            * \`${VALIDATE_PRIVATE_STATICS_AS_PRIVATE.toString()}\` enforces validation as private.
            * \`${VALIDATE_PRIVATE_STATICS_AS_STATIC.toString()}\` enforces validation as static.
            * \`${VALIDATE_PRIVATE_STATICS_AS_EITHER.toString()}\` enforces validation as either.
            `,
        options: {
            type: 'array',
            items: [
                {
                    type: 'string',
                    enum: [VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER]
                }
            ],
            minLength: 0,
            maxLength: 2
        },
        optionExamples: [
            [true, VALIDATE_PRIVATE_STATICS_AS_EITHER],
            [true, VALIDATE_PRIVATE_STATICS_AS_PRIVATE],
            [true, VALIDATE_PRIVATE_STATICS_AS_STATIC],
            [true]
        ],
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FunctionNameRuleWalker(sourceFile, this.getOptions()));
    }
}

class FunctionNameRuleWalker extends ErrorTolerantWalker {

    private methodRegex: RegExp = /^[a-z][\w\d]+$/;
    private privateMethodRegex: RegExp = this.methodRegex;
    private protectedMethodRegex: RegExp = this.privateMethodRegex;
    private staticMethodRegex: RegExp = /^[A-Z_\d]+$/;
    private functionRegex: RegExp = /^[a-z][\w\d]+$/;
    private args: Options;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.args = parseOptions(options.ruleArguments);
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                this.methodRegex = this.getOptionOrDefault(opt, METHOD_REGEX, this.methodRegex);
                this.privateMethodRegex = this.getOptionOrDefault(opt, PRIVATE_METHOD_REGEX, this.privateMethodRegex);
                this.protectedMethodRegex = this.getOptionOrDefault(opt, PROTECTED_METHOD_REGEX, this.protectedMethodRegex);
                this.staticMethodRegex = this.getOptionOrDefault(opt, STATIC_METHOD_REGEX, this.staticMethodRegex);
                this.functionRegex = this.getOptionOrDefault(opt, FUNCTION_REGEX, this.functionRegex);
            }
        });
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        const name: string = node.name.getText();
        if (AstUtils.isPrivate(node)) {
            if (
                !this.privateMethodRegex.test(name)
                && (this.args.validateStatics === VALIDATE_PRIVATE_STATICS_AS_PRIVATE || this.args.validateStatics === NOT_VALID_ARG)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(),
                    `Private method name does not match ${this.privateMethodRegex}: ${name}`);
            }
        } else if (AstUtils.isProtected(node)) {
            if (!this.protectedMethodRegex.test(name)
            && (this.args.validateStatics === VALIDATE_PRIVATE_STATICS_AS_PRIVATE || this.args.validateStatics === NOT_VALID_ARG)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(),
                    `Protected method name does not match ${this.protectedMethodRegex}: ${name}`);
            }
        } else if (AstUtils.isStatic(node)) {
            if (!this.staticMethodRegex.test(name)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(),
                    `Static method name does not match ${this.staticMethodRegex}: ${name}`);
            }
        } else if (!this.methodRegex.test(name)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth(),
                `Method name does not match ${this.methodRegex}: ${name}`);
        }
        super.visitMethodDeclaration(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        if (node.name != null) {
            const name: string = node.name.text;
            if (!this.functionRegex.test(name)) {
                this.addFailureAt(node.name.getStart(), node.name.getWidth(),
                    `Function name does not match ${this.functionRegex}: ${name}`);
            }
        }
        super.visitFunctionDeclaration(node);
    }

    private getOptionOrDefault(option: any, key: string, defaultValue: RegExp): RegExp {
        try {
            if (option[key] != null) {
                return new RegExp(option[key]);
            }
        } catch (e) {
            /* tslint:disable:no-console */
            console.error('Could not read ' + key + ' within function-name configuration');
            /* tslint:enable:no-console */
        }
        return defaultValue;
    }
}
