import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-duplicate-parameter-names',
        type: 'maintainability',
        description: 'Deprecated - This rule is now enforced by the TypeScript compiler',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false, // now supported by TypeScript compiler'
    };

    public static FAILURE_STRING: string = 'Duplicate parameter name: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateParameterNamesWalker(sourceFile, this.getOptions()));
    }
}

class NoDuplicateParameterNamesWalker extends Lint.RuleWalker {
    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validateParameterNames(node);
        super.visitMethodDeclaration(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.validateParameterNames(node);
        super.visitConstructorDeclaration(node);
    }

    protected visitArrowFunction(node: ts.ArrowFunction): void {
        this.validateParameterNames(node);
        super.visitArrowFunction(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validateParameterNames(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.validateParameterNames(node);
        super.visitFunctionExpression(node);
    }

    private validateParameterNames(node: ts.SignatureDeclaration) {
        const seenNames: { [index: string]: boolean } = {};
        node.parameters.forEach(
            (parameter: ts.ParameterDeclaration): void => {
                const parameterName: string = parameter.name.getText(); // how does one check if the union type is Identifier?
                if (parameterName !== undefined) {
                    if (seenNames[parameterName]) {
                        this.addFailureAt(parameter.name.getStart(), parameterName.length, Rule.FAILURE_STRING + "'" + parameterName + "'");
                    } else {
                        seenNames[parameterName] = true;
                    }
                }
            }
        );
    }
}
