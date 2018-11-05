import * as ts from 'typescript';
import * as Lint from 'tslint';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-function-expression',
        type: 'maintainability',
        description: 'Do not use function expressions; use arrow functions (lambdas) instead.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Use arrow function instead of function expression';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFunctionExpressionRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoFunctionExpressionRuleWalker extends Lint.RuleWalker {
    private readonly allowGenericFunctionExpression: boolean = false;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        if (AstUtils.getLanguageVariant(sourceFile) === ts.LanguageVariant.JSX) {
            this.allowGenericFunctionExpression = true;
        }
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        const walker = new SingleFunctionWalker(this.getSourceFile(), this.getOptions());
        node.getChildren().forEach((child: ts.Node) => {
            walker.walk(child);
        });

        const isGenericFunctionInTSX = this.allowGenericFunctionExpression && walker.isGenericFunction;
        // function expression that access 'this' is allowed
        if (
            !walker.isAccessingThis &&
            !node.asteriskToken &&
            // generic function expression in .tsx file is allowed
            !isGenericFunctionInTSX
        ) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }

        super.visitFunctionExpression(node);
    }
}

class SingleFunctionWalker extends Lint.RuleWalker {
    public isAccessingThis: boolean = false;
    public isGenericFunction: boolean = false;
    protected visitNode(node: ts.Node): void {
        if (node.getText() === 'this') {
            this.isAccessingThis = true;
        }
        super.visitNode(node);
    }

    protected visitTypeReference(node: ts.TypeReferenceNode): void {
        this.isGenericFunction = true;
        super.visitTypeReference(node);
    }

    /* tslint:disable:no-empty */
    protected visitFunctionExpression(): void {
        // do not visit inner blocks
    }
    protected visitArrowFunction(): void {
        // do not visit inner blocks
    }
    /* tslint:enable:no-empty */
}
