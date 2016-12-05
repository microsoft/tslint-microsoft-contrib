import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the prefer-array-literal rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'prefer-array-literal',
        type: 'maintainability',
        description: 'Use array literal syntax when declaring or instantiating array types.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static GENERICS_FAILURE_STRING: string = 'Replace generic-typed Array with array literal: ';
    public static CONSTRUCTOR_FAILURE_STRING: string = 'Replace Array constructor with an array literal: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoGenericArrayWalker(sourceFile, this.getOptions()));
    }
}

class NoGenericArrayWalker extends ErrorTolerantWalker {

    private allowTypeParameters: boolean = false;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                this.allowTypeParameters = opt['allow-type-parameters'] === true;
            }
        });
    }

    protected visitTypeReference(node: ts.TypeReferenceNode): void {
        if (this.allowTypeParameters === false) {
            if ((<ts.Identifier>node.typeName).text === 'Array') {
                const failureString = Rule.GENERICS_FAILURE_STRING + node.getText();
                const failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                this.addFailure(failure);
            }
        }
        super.visitTypeReference(node);
    }

    protected visitNewExpression(node: ts.NewExpression): void {
        const functionName  = AstUtils.getFunctionName(node);
        if (functionName === 'Array') {
            const failureString = Rule.CONSTRUCTOR_FAILURE_STRING + node.getText();
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), failureString));
        }
        super.visitNewExpression(node);
    }
}
