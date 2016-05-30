import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import AstUtils = require('./utils/AstUtils');
import Utils = require('./utils/Utils');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the jquery-deferred-must-complete rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new JQueryDeferredAnalyzer(sourceFile, this.getOptions()));
    }

}

function isPromiseInstantiation(expression: ts.Expression) : boolean {
    if (expression != null && expression.kind === SyntaxKind.current().CallExpression) {
        const functionName = AstUtils.getFunctionName(<ts.CallExpression>expression);
        const functionTarget = AstUtils.getFunctionTarget(<ts.CallExpression>expression);

        if (functionName === 'Deferred' &&
            (functionTarget === '$' || /^(jquery)$/i.test(functionTarget))) {
            return true;
        }
    }
    return false;
}

function isCompletionFunction(functionName : string) : boolean {
    return /^(resolve|reject)$/.test(functionName);
}

class JQueryDeferredAnalyzer extends ErrorTolerantWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (node.operatorToken.getText() === '=' && isPromiseInstantiation(node.right)) {
            if (node.left.kind === SyntaxKind.current().Identifier) {
                if ((<ts.Identifier>node.left).text != null) {
                    const name : ts.Identifier = <ts.Identifier>node.left;
                    this.validateDeferredUsage(node, name);
                }
            }
        }
        super.visitBinaryExpression(node);
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (isPromiseInstantiation(node.initializer)) {
            if ((<ts.Identifier>node.name).text != null) {
                const name : ts.Identifier = <ts.Identifier>node.name;
                this.validateDeferredUsage(node, name);
            }
        }
        super.visitVariableDeclaration(node);
    }

    private validateDeferredUsage(rootNode: ts.Node, deferredIdentifier: ts.Identifier) : void {
        const parent : ts.Node = AstUtils.findParentBlock(rootNode);
        const blockAnalyzer = new DeferredCompletionWalker(this.getSourceFile(), this.getOptions(), deferredIdentifier);
        blockAnalyzer.visitNode(parent);
        if (!blockAnalyzer.isAlwaysCompleted()) {
            const failureString = Rule.FAILURE_STRING + '\'' + rootNode.getText() + '\'';
            const failure = this.createFailure(rootNode.getStart(), rootNode.getWidth(), failureString);
            this.addFailure(failure);
        }
    }

}

class DeferredCompletionWalker extends ErrorTolerantWalker {
    private deferredIdentifier : ts.Identifier;
    private wasCompleted : boolean = false;
    private allBranchesCompleted : boolean = true; // by default, there are no branches, so this is true
    private hasBranches : boolean = false;
    private walkerOptions: Lint.IOptions;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, deferredIdentifier : ts.Identifier) {
        super(sourceFile, options);
        this.walkerOptions = options; // we need to store this because this.getOptions() returns undefined even when this has a value
        this.deferredIdentifier = deferredIdentifier;
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
        const ifAnalyzer = new DeferredCompletionWalker(this.getSourceFile(), this.walkerOptions, this.deferredIdentifier);
        const elseAnalyzer = new DeferredCompletionWalker(this.getSourceFile(), this.walkerOptions, this.deferredIdentifier);

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
        if (node.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
            const prop : ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.expression;

            if (AstUtils.isSameIdentifer(this.deferredIdentifier, prop.expression)) {
                const functionName : string = prop.name.getText(); // possibly resolve or reject
                if (isCompletionFunction(functionName)) {
                    this.wasCompleted = true;
                    return; // this branch was completed, do not walk any more.
                }
            }
        }

        const referenceEscaped : boolean = Utils.exists(node.arguments, (argument: ts.Expression) : boolean => {
            return AstUtils.isSameIdentifer(this.deferredIdentifier, argument);
        });
        if (referenceEscaped) {
            this.wasCompleted = true;
            return; // this branch was completed, do not walk any more.
        }
        super.visitCallExpression(node);
    }


    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        const isDeferredShadowed : boolean = Utils.exists(node.parameters, (param : ts.ParameterDeclaration) : boolean => {
            return AstUtils.isSameIdentifer(this.deferredIdentifier, param.name);
        });
        if (isDeferredShadowed) {
            this.hasBranches = true;
            this.allBranchesCompleted = false;
            return; // this branch was completed, do not walk any more.
        }
        super.visitArrowFunction(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        const isDeferredShadowed : boolean = Utils.exists(node.parameters, (param : ts.ParameterDeclaration) : boolean => {
            return AstUtils.isSameIdentifer(this.deferredIdentifier, param.name);
        });
        if (isDeferredShadowed) {
            this.hasBranches = true;
            this.allBranchesCompleted = false;
            return; // this branch was completed, do not walk any more.
        }
        super.visitFunctionExpression(node);
    }
}
