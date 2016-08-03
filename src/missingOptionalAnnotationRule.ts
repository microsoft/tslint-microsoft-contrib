import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the missing-optional-annotation rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'missing-optional-annotation',
        type: 'maintainability',
        description: 'Deprecated - This rule is now enforced by the TypeScript compiler',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false,  // now supported by TypeScript compiler'
    };

    public static FAILURE_STRING = 'Argument following optional argument missing optional annotation: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingOptionalAnnotationWalker(sourceFile, this.getOptions()));
    }
}

class MissingOptionalAnnotationWalker extends ErrorTolerantWalker {
    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validateParameters(node);
        super.visitMethodDeclaration(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.validateParameters(node);
        super.visitConstructorDeclaration(node);
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.validateParameters(node);
        super.visitArrowFunction(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validateParameters(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.validateParameters(node);
        super.visitFunctionExpression(node);
    }

    private validateParameters(node : ts.SignatureDeclaration) {
        let optionalParameterFound = false;
        if (node.parameters == null) {
            return;
        }
        node.parameters.forEach((parameter : ts.ParameterDeclaration) : void => {
            if (parameter.questionToken != null || parameter.initializer != null) {
                optionalParameterFound = true;
            } else if (optionalParameterFound && parameter.initializer == null) {
                // we found a non-optional parameter that comes *after* an optional parameter
                const msg = Rule.FAILURE_STRING + parameter.getFullText();
                this.addFailure(this.createFailure(parameter.name.getStart(), parameter.name.getWidth(), msg));
            }
        });
    }
}
