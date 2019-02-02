import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { AstUtils } from './utils/AstUtils';

const FAILURE_UNDEFINED_INIT: string = 'Unnecessary field initialization. Field explicitly initialized to undefined: ';
const FAILURE_UNDEFINED_DUPE: string = 'Unnecessary field initialization. Field value already initialized in declaration: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-field-initialization',
        type: 'maintainability',
        description: 'Do not unnecessarily initialize the fields of a class to values they already have.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    let fieldInitializations: { [index: string]: string | undefined } = {};

    function visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        if (node.body !== undefined) {
            node.body.statements.forEach(
                (statement: ts.Statement): void => {
                    if (tsutils.isExpressionStatement(statement)) {
                        const expression: ts.Expression = statement.expression;
                        if (tsutils.isBinaryExpression(expression)) {
                            const binaryExpression: ts.BinaryExpression = expression;

                            const property: ts.Expression = binaryExpression.left;
                            const propertyName: string = property.getText();
                            // check to see if a field is being assigned in the constructor
                            if (Object.keys(fieldInitializations).indexOf(propertyName) > -1) {
                                if (AstUtils.isUndefined(binaryExpression.right)) {
                                    // field is being assigned to undefined... create error if the field already has that value
                                    if (Object.keys(fieldInitializations).indexOf(propertyName) > -1) {
                                        // make sure the field was declared as undefined
                                        const fieldInitValue = fieldInitializations[propertyName];
                                        if (fieldInitValue === undefined) {
                                            const start: number = property.getStart();
                                            const width: number = property.getWidth();
                                            ctx.addFailureAt(start, width, FAILURE_UNDEFINED_INIT + property.getText());
                                        }
                                    }
                                } else if (AstUtils.isConstant(binaryExpression.right)) {
                                    // field is being assigned a constant... create error if the field already has that value
                                    const fieldInitValue = fieldInitializations[propertyName];
                                    if (fieldInitValue === binaryExpression.right.getText()) {
                                        const start: number = binaryExpression.getStart();
                                        const width: number = binaryExpression.getWidth();
                                        const message: string = FAILURE_UNDEFINED_DUPE + binaryExpression.getText();
                                        ctx.addFailureAt(start, width, message);
                                    }
                                }
                            }
                        }
                    }
                }
            );
        }
    }

    function visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        const initializer = node.initializer;
        if (tsutils.isIdentifier(node.name)) {
            const fieldName: string = 'this.' + node.name.getText();
            if (initializer === undefined) {
                fieldInitializations[fieldName] = undefined;
            } else if (AstUtils.isConstant(initializer)) {
                fieldInitializations[fieldName] = initializer.getText();
            }
        }
        if (initializer !== undefined && AstUtils.isUndefined(initializer)) {
            // you should never initialize a field to undefined.
            const start: number = initializer.getStart();
            const width: number = initializer.getWidth();
            ctx.addFailureAt(start, width, FAILURE_UNDEFINED_INIT + node.name.getText());
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isClassDeclaration(node)) {
            fieldInitializations = {};
            node.members.forEach(
                (member: ts.ClassElement): void => {
                    if (tsutils.isPropertyDeclaration(member)) {
                        visitPropertyDeclaration(member);
                    } else if (tsutils.isConstructorDeclaration(member)) {
                        visitConstructorDeclaration(member);
                    }
                }
            );

            fieldInitializations = {};
        }
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
