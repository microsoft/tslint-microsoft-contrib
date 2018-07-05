import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {AstUtils} from './utils/AstUtils';
import {MochaUtils} from './utils/MochaUtils';
import {Utils} from './utils/Utils';

const FAILURE_STRING: string = 'Mocha test contains dangerous variable initialization. Move to before()/beforeEach(): ';

/**
 * Implementation of the mocha-no-side-effect-code rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'mocha-no-side-effect-code',
        type: 'maintainability',
        description: 'All test logic in a Mocha test case should be within Mocha lifecycle method.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',  // one of 'Mandatory' | 'Opportunity for Excellence'
        group: 'Correctness'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MochaNoSideEffectCodeRuleWalker(sourceFile, this.getOptions()));
    }
}

class MochaNoSideEffectCodeRuleWalker extends ErrorTolerantWalker {

    private isInDescribe: boolean = false;
    private ignoreRegex: RegExp;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.parseOptions();
    }

    private parseOptions () {
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                if (opt.ignore != null) {
                    this.ignoreRegex = new RegExp(opt.ignore);
                }
            }
        });
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        if (MochaUtils.isMochaTest(node)) {
            node.statements.forEach((statement: ts.Statement): void => {
                // validate variable declarations in global scope
                if (statement.kind === ts.SyntaxKind.VariableStatement) {
                    const declarationList: ts.VariableDeclarationList = (<ts.VariableStatement>statement).declarationList;
                    declarationList.declarations.forEach((declaration: ts.VariableDeclaration): void => {
                        this.validateExpression(declaration.initializer, declaration);
                    });
                }

                // walk into the describe calls
                if (MochaUtils.isStatementDescribeCall(statement)) {
                    const expression: ts.Expression = (<ts.ExpressionStatement>statement).expression;
                    const call: ts.CallExpression = <ts.CallExpression>expression;
                    this.visitCallExpression(call);
                }
            });
        }
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (this.isInDescribe === true) {
            this.validateExpression(node.initializer, node);
        }
    }

    protected visitFunctionDeclaration(): void {
        // never walk into function declarations. new scopes are inherently safe
    }

    protected visitClassDeclaration(): void {
        // never walk into class declarations. new scopes are inherently safe
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        if (MochaUtils.isDescribe(node)) {
            const nestedSubscribe = this.isInDescribe;
            this.isInDescribe = true;
            super.visitCallExpression(node);
            if (nestedSubscribe === false) {
                this.isInDescribe = false;
            }
        } else if (MochaUtils.isLifecycleMethod(node)) {
            // variable initialization is allowed inside the lifecycle methods, so do not visit them
            return;
        } else if (this.isInDescribe) {
            // raw CallExpressions should be banned inside a describe that are *not* inside a lifecycle method
            this.validateExpression(node, node);
        }
    }

    private validateExpression(initializer: ts.Expression, parentNode: ts.Node): void {
        if (initializer == null) {
            return;
        }
        // constants cannot throw errors in the test runner
        if (AstUtils.isConstant(initializer)) {
            return;
        }
        // function expressions are not executed now and will not throw an error
        if (initializer.kind === ts.SyntaxKind.FunctionExpression
            || initializer.kind === ts.SyntaxKind.ArrowFunction) {
            return;
        }
        // empty arrays and arrays filled with constants are allowed
        if (initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const arrayLiteral: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>initializer;
            arrayLiteral.elements.forEach((expression: ts.Expression): void => {
                this.validateExpression(expression, parentNode);
            });
            return;
        }
        // template strings are OK (it is too hard to analyze a template string fully)
        if (initializer.kind === ts.SyntaxKind.FirstTemplateToken) {
            return;
        }
        // type assertions are OK, but check the initializer
        if (initializer.kind === ts.SyntaxKind.TypeAssertionExpression) {
            const assertion: ts.TypeAssertion = <ts.TypeAssertion>initializer;
            this.validateExpression(assertion.expression, parentNode);
            return;
        }
        // Property aliasing is OK
        if (initializer.kind === ts.SyntaxKind.PropertyAccessExpression) {
            return;
        }
        // simple identifiers are OK
        if (initializer.kind === ts.SyntaxKind.Identifier) {
            return;
        }
        // a simple object literal can contain many violations
        if (initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const literal: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>initializer;

            literal.properties.forEach((element: ts.ObjectLiteralElement): void => {
                if (element.kind === ts.SyntaxKind.PropertyAssignment) {
                    const assignment: ts.PropertyAssignment = <ts.PropertyAssignment>element;
                    this.validateExpression(assignment.initializer, parentNode);
                }
            });
            return;
        }
        // From https://mochajs.org/, `this.retries(...)`, `this.slow(...)`, and
        // `this.timeout(...)` are allowed outside tests
        if (/^this\.(retries|slow|timeout)\(.+\)$/.test(initializer.getText())) {
            return;
        }
        // moment() is OK
        if (initializer.getText() === 'moment()') {
            return;
        }
        if (initializer.kind === ts.SyntaxKind.CallExpression
                && AstUtils.getFunctionTarget(<ts.CallExpression>initializer) === 'moment()') {
            return;
        }
        // new Date is OK
        if (initializer.kind === ts.SyntaxKind.NewExpression) {
            if (AstUtils.getFunctionName(<ts.NewExpression>initializer) === 'Date') {
                return;
            }
        }
        // ignore anything matching our ignore regex
        if (this.ignoreRegex != null && this.ignoreRegex.test(initializer.getText())) {
            return;
        }

        if (AstUtils.isConstantExpression(initializer)) {
            return;
        }
        //console.log(ts.SyntaxKind[initializer.kind] + ' ' + initializer.getText());
        const message: string = FAILURE_STRING + Utils.trimTo(parentNode.getText(), 30);
        this.addFailureAt(parentNode.getStart(), parentNode.getWidth(), message);
    }
}
