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

/**
 * Implementation of the function-name rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'function-name',
        type: 'maintainability',
        description: 'Applies a naming convention to function names and method names',
        options: null,
        optionsDescription: "",
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

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
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
            if (!this.privateMethodRegex.test(name)) {
                this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(),
                    `Private method name does not match ${this.privateMethodRegex}: ${name}`));
            }
        } else if (AstUtils.isProtected(node)) {
            if (!this.protectedMethodRegex.test(name)) {
                this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(),
                    `Protected method name does not match ${this.protectedMethodRegex}: ${name}`));
            }
        } else if (AstUtils.isStatic(node)) {
            if (!this.staticMethodRegex.test(name)) {
                this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(),
                    `Static method name does not match ${this.staticMethodRegex}: ${name}`));
            }
        } else if (!this.methodRegex.test(name)) {
            this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(),
                `Method name does not match ${this.methodRegex}: ${name}`));
        }
        super.visitMethodDeclaration(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        if (node.name != null) {
            const name: string = node.name.text;
            if (!this.functionRegex.test(name)) {
                this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(),
                    `Function name does not match ${this.functionRegex}: ${name}`));
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
