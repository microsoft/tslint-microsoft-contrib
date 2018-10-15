import * as ts from 'typescript';
import * as Lint from 'tslint';

import {AstUtils} from './utils/AstUtils';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-constant-condition',
        type: 'maintainability',
        description: 'Do not use constant expressions in conditions.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 570, 571, 670'
    };

    public static FAILURE_STRING: string = 'Found constant conditional: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstantConditionRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoConstantConditionRuleWalker extends ErrorTolerantWalker {

    private checkLoops: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.checkLoops = this.extractBoolean('checkLoops');
    }

    private extractBoolean(keyName: string): boolean {
        let result : boolean = true;
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                if (opt[keyName] === false || opt[keyName] === 'false') {
                    result = false;
                }
            }
        });
        return result;
    }

    protected visitIfStatement(node: ts.IfStatement): void {
        if (AstUtils.isConstantExpression(node.expression)) {
            const message: string = Rule.FAILURE_STRING + 'if (' + node.expression.getText() + ')';
            this.addFailureAt(node.getStart(), node.getWidth(), message);
        }
        super.visitIfStatement(node);
    }

    protected visitConditionalExpression(node: ts.ConditionalExpression): void {
        if (AstUtils.isConstantExpression(node.condition)) {
            const message: string = Rule.FAILURE_STRING + node.condition.getText() + ' ?';
            this.addFailureAt(node.getStart(), node.getWidth(), message);
        }
        super.visitConditionalExpression(node);
    }

    protected visitWhileStatement(node: ts.WhileStatement): void {
        if (this.checkLoops) {
            if (AstUtils.isConstantExpression(node.expression)) {
                const message: string = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
                this.addFailureAt(node.getStart(), node.getWidth(), message);
            }
        }
        super.visitWhileStatement(node);
    }

    protected visitDoStatement(node: ts.DoStatement): void {
        if (this.checkLoops) {
            if (AstUtils.isConstantExpression(node.expression)) {
                const message: string = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
                this.addFailureAt(node.getStart(), node.getWidth(), message);
            }
        }
        super.visitDoStatement(node);
    }

    protected visitForStatement(node: ts.ForStatement): void {
        if (this.checkLoops && node.condition != null) {
            if (AstUtils.isConstantExpression(node.condition)) {
                const message: string = Rule.FAILURE_STRING + ';' + node.condition.getText() + ';';
                this.addFailureAt(node.getStart(), node.getWidth(), message);
            }
        }
        super.visitForStatement(node);
    }
}
