import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');
import AstUtils = require('./utils/AstUtils');
import Utils = require('./utils/Utils');


const FAILURE_STRING: string = 'A stateless class was found. This indicates a failure in the object model: ';

/**
 * Implementation of the no-stateless-classes rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoStatelessClassRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoStatelessClassRuleWalker extends ErrorTolerantWalker {
    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        if (!this.isClassStateful(node)) {
            const className: string = node.name == null ? '<unknown>' : node.name.text;
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + className));
        }
        super.visitClassDeclaration(node);
    }

    private isClassStateful(node: ts.ClassDeclaration): boolean {
        if (Utils.exists(node.heritageClauses, (clause: ts.HeritageClause): boolean => {
                return clause.token === SyntaxKind.current().ExtendsKeyword;
            })) {
            return true;
        }
        if (node.members.length === 0) {
            return false;
        }
        return Utils.exists(node.members, (classElement: ts.ClassElement): boolean => {
            if (classElement.kind === SyntaxKind.current().Constructor) {
                return false;
            }
            if (AstUtils.isStatic(classElement)) {
                return false;
            }
            return true;
        });
    }
}
