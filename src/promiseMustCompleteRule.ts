import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the promise-must-complete rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'promise-must-complete',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'When a Promise instance is created, then either the reject() or resolve() parameter must be ' +
                    'called on it within all code branches in the scope.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public static FAILURE_STRING: string = 'A Promise was found that appears to not have resolve or reject invoked on all code paths';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PromiseAnalyzer(sourceFile, this.getOptions()));
    }
}

class PromiseAnalyzer extends ErrorTolerantWalker {
    private isPromiseDeclaration(node: ts.NewExpression): boolean {
        if (node.expression.kind === ts.SyntaxKind.Identifier
            && node.expression.getText() === 'Promise'
            && node.arguments != null && node.arguments.length > 0) {
            const firstArg: ts.Expression = node.arguments[0];
            if (firstArg.kind === ts.SyntaxKind.ArrowFunction || firstArg.kind === ts.SyntaxKind.FunctionExpression) {
                return true;
            }
        }
        return false;
    }

    private getCompletionIdentifiers(declaration: ts.SignatureDeclaration): ts.Identifier[] {
        const result: ts.Identifier[] = [];
        if (declaration.parameters == null || declaration.parameters.length === 0) {
            return result;
        }

        const arg1: ts.ParameterDeclaration = declaration.parameters[0];
        const arg2: ts.ParameterDeclaration = declaration.parameters[1];
        if (arg1 != null && arg1.name.kind === ts.SyntaxKind.Identifier) {
            result.push(<ts.Identifier>declaration.parameters[0].name);
        }
        if (arg2 != null && arg2.name.kind === ts.SyntaxKind.Identifier) {
            result.push(<ts.Identifier>declaration.parameters[1].name);
        }
        return result;
    }

    protected visitNewExpression(node: ts.NewExpression): void {
        if (this.isPromiseDeclaration(node)) {
            const functionArgument: ts.FunctionLikeDeclaration = <ts.FunctionLikeDeclaration><any>node.arguments[0];
            const functionBody = functionArgument.body;
            const competionIdentifiers : ts.Identifier[] = this.getCompletionIdentifiers(functionArgument);
            this.validatePromiseUsage(node, functionBody, competionIdentifiers);
        }
        super.visitNewExpression(node);
    }

    private validatePromiseUsage(promiseInstantiation: ts.NewExpression, block: ts.Node, completionIdentifiers: ts.Identifier[]) : void {
        const blockAnalyzer = new PromiseCompletionWalker(this.getSourceFile(), this.getOptions(), completionIdentifiers);
        blockAnalyzer.visitNode(block);
        if (!blockAnalyzer.isAlwaysCompleted()) {
            this.addFailureAt(promiseInstantiation.getStart(), promiseInstantiation.getWidth(), Rule.FAILURE_STRING);
        }
    }
}

class PromiseCompletionWalker extends ErrorTolerantWalker {
    private completionIdentifiers: ts.Identifier[];
    private wasCompleted : boolean = false;
    private allBranchesCompleted : boolean = true; // by default, there are no branches, so this is true
    private hasBranches : boolean = false;
    private walkerOptions: Lint.IOptions;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, completionIdentifiers: ts.Identifier[]) {
        super(sourceFile, options);
        this.walkerOptions = options; // we need to store this because this.getOptions() returns undefined even when this has a value
        this.completionIdentifiers = completionIdentifiers;
    }

    // need to make this public so it can invoked from parent walker
    /* tslint:disable:no-unnecessary-override */
    public visitNode(node: ts.Node): void {
        super.visitNode(node);
    }
    /* tslint:enable:no-unnecessary-override */

    public isAlwaysCompleted() : boolean {
        if (this.wasCompleted) {
            return true; // if the main code path completed then it doesn't matter what the child branches did
        }
        if (!this.hasBranches) {
            return false; // if there were no branches and it is not complete... then it is in total not complete.
        }
        return this.allBranchesCompleted; // if main path did *not* complete, the look at child branch status
    }

    protected visitIfStatement(node: ts.IfStatement): void {
        this.hasBranches = true;

        // an if statement is a branch, so we need to see if this branch completes.
        const ifAnalyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, this.completionIdentifiers);
        const elseAnalyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, this.completionIdentifiers);

        ifAnalyzer.visitNode(node.thenStatement);

        if (!ifAnalyzer.isAlwaysCompleted()) {
            this.allBranchesCompleted = false;
        } else if (node.elseStatement != null) {
            elseAnalyzer.visitNode(node.elseStatement);
            if (!elseAnalyzer.isAlwaysCompleted()) {
                this.allBranchesCompleted = false;
            }
        }
        // there is no need to call super.visit because we already took care of walking all the branches
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        if (node.expression.kind === ts.SyntaxKind.Identifier) {
            if (this.isCompletionIdentifier(node.expression)) {
                this.wasCompleted = true;
                return; // this branch was completed, do not walk any more.
            }
        }

        const referenceEscaped : boolean = Utils.exists(node.arguments, (argument: ts.Expression) : boolean => {
            return this.isCompletionIdentifier(argument);
        });
        if (referenceEscaped) {
            this.wasCompleted = true;
            return; // this branch was completed, do not walk any more.
        }
        super.visitCallExpression(node);
    }

    protected visitArrowFunction(node: ts.ArrowFunction): void {
        // walk into function body but do not track any shadowed identifiers
        const nonShadowedIdentifiers: ts.Identifier[] = this.getNonShadowedCompletionIdentifiers(node);
        const analyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, nonShadowedIdentifiers);
        analyzer.visitNode(node.body);
        if (analyzer.isAlwaysCompleted()) {
            this.wasCompleted = true;
        }
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        // walk into function body but do not track any shadowed identifiers
        const nonShadowedIdentifiers: ts.Identifier[] = this.getNonShadowedCompletionIdentifiers(node);
        const analyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, nonShadowedIdentifiers);
        analyzer.visitNode(node.body);
        if (analyzer.isAlwaysCompleted()) {
            this.wasCompleted = true;
        }
    }

    private getNonShadowedCompletionIdentifiers(declaration: ts.FunctionLikeDeclaration): ts.Identifier[] {
        const result: ts.Identifier[] = [];
        this.completionIdentifiers.forEach((identifier: ts.Identifier): void => {
            // if this identifier is not shadowed, then add it to result
            const isShadowed: boolean = Utils.exists(declaration.parameters, (parameter: ts.ParameterDeclaration): boolean => {
                return AstUtils.isSameIdentifer(identifier, parameter.name);
            });
            if (!isShadowed) {
                result.push(identifier);
            }
        });

        return result;
    }

    private isCompletionIdentifier(sourceIdentifier: ts.Node): boolean {
        return Utils.exists(this.completionIdentifiers, (identifier: ts.Identifier): boolean => {
            return AstUtils.isSameIdentifer(sourceIdentifier, identifier);
        });

    }
}
