import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import AstUtils = require('./utils/AstUtils');

const METHOD_REGEX = 'method-regex';
const PRIVATE_METHOD_REGEX = 'private-method-regex';
const STATIC_METHOD_REGEX = 'static-method-regex';
const FUNCTION_REGEX = 'function-regex';

/**
 * Implementation of the function-name rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FunctionNameRuleWalker(sourceFile, this.getOptions()));
    }
}

class FunctionNameRuleWalker extends ErrorTolerantWalker {

    private methodRegex: RegExp = /^[a-z][\w\d]+$/;
    private privateMethodRegex: RegExp = /^[a-z][\w\d]+$/;
    private staticMethodRegex: RegExp = /^[A-Z_\d]+$/;
    private functionRegex: RegExp = /^[a-z][\w\d]+$/;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                this.methodRegex = this.getOptionOrDefault(opt, METHOD_REGEX, this.methodRegex);
                this.privateMethodRegex = this.getOptionOrDefault(opt, PRIVATE_METHOD_REGEX, this.privateMethodRegex);
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
