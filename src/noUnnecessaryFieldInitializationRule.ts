import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {AstUtils} from './utils/AstUtils';

const FAILURE_UNDEFINED_INIT: string = 'Unnecessary field initialization. Field explicitly initialized to undefined: ';
const FAILURE_UNDEFINED_DUPE: string = 'Unnecessary field initialization. Field value already initialized in declaration: ';

/**
 * Implementation of the no-unnecessary-field-initialization rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-field-initialization',
        type: 'maintainability',
        description: 'Do not unnecessarily initialize the fields of a class to values they already have.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UnnecessaryFieldInitializationRuleWalker(sourceFile, this.getOptions()));
    }
}

class UnnecessaryFieldInitializationRuleWalker extends ErrorTolerantWalker {

    private fieldInitializations: { [index: string]: string } = {};

    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.fieldInitializations = {};
        node.members.forEach((member: ts.ClassElement): void => {
            if (member.kind === SyntaxKind.current().PropertyDeclaration) {
                this.visitPropertyDeclaration(<ts.PropertyDeclaration>member);
            } else if (member.kind === SyntaxKind.current().Constructor) {
                this.visitConstructorDeclaration(<ts.ConstructorDeclaration>member);
            }
        });
        this.fieldInitializations = {};
        // do not call super.visitClass as a performance enhancement
    }

    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        const initializer: ts.Expression = node.initializer;
        if (node.name.kind === SyntaxKind.current().Identifier) {
            const fieldName: string = 'this.' + (<ts.Identifier>node.name).getText();
            if (initializer == null) {
                this.fieldInitializations[fieldName] = undefined;
            } else if (AstUtils.isConstant(initializer)) {
                this.fieldInitializations[fieldName] = initializer.getText();
            }
        }
        if (AstUtils.isUndefined(initializer)) {
            // you should never initialize a field to undefined.
            const start: number = initializer.getStart();
            const width: number = initializer.getWidth();
            this.addFailure(this.createFailure(start, width, FAILURE_UNDEFINED_INIT + node.name.getText()));
        }
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        if (node.body != null) {
            node.body.statements.forEach((statement: ts.Statement): void => {
                if (statement.kind === SyntaxKind.current().ExpressionStatement) {
                    const expression: ts.Expression = (<ts.ExpressionStatement>statement).expression;
                    if (expression.kind === SyntaxKind.current().BinaryExpression) {
                        const binaryExpression: ts.BinaryExpression = <ts.BinaryExpression>expression;

                        const property: ts.Expression = binaryExpression.left;
                        const propertyName: string = property.getText();
                        // check to see if a field is being assigned in the constructor
                        if (Object.keys(this.fieldInitializations).indexOf(propertyName) > -1) {
                            if (AstUtils.isUndefined(binaryExpression.right)) {
                                // field is being assigned to undefined... create error if the field already has that value
                                if (Object.keys(this.fieldInitializations).indexOf(propertyName) > -1) {
                                    // make sure the field was declared as undefined
                                    const fieldInitValue: string = this.fieldInitializations[propertyName];
                                    if (fieldInitValue == null) {
                                        const start: number = property.getStart();
                                        const width: number = property.getWidth();
                                        this.addFailure(this.createFailure(start, width, FAILURE_UNDEFINED_INIT + property.getText()));
                                    }
                                }
                            } else if (AstUtils.isConstant(binaryExpression.right)) {
                                // field is being assigned a constant... create error if the field already has that value
                                const fieldInitValue: string = this.fieldInitializations[propertyName];
                                if (fieldInitValue === binaryExpression.right.getText()) {
                                    const start: number = binaryExpression.getStart();
                                    const width: number = binaryExpression.getWidth();
                                    const message: string = FAILURE_UNDEFINED_DUPE + binaryExpression.getText();
                                    this.addFailure(this.createFailure(start, width, message));
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}
