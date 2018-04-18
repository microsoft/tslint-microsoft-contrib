import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'A stateless class was found. This indicates a failure in the object model: ';

/**
 * Implementation of the no-stateless-classes rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-stateless-class',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'A stateless class represents a failure in the object oriented design of the system.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        recommendation: 'false,',
        group: 'Deprecated',
        commonWeaknessEnumeration: '398, 710'
    };

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-stateless-class rule is deprecated. Replace your usage with the TSLint no-unnecessary-class rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new NoStatelessClassRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoStatelessClassRuleWalker extends ErrorTolerantWalker {
    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        if (!this.isClassStateful(node)) {
            const className: string = node.name == null ? '<unknown>' : node.name.text;
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + className);
        }
        super.visitClassDeclaration(node);
    }

    private isClassStateful(node: ts.ClassDeclaration): boolean {
        if (this.classExtendsSomething(node)) {
            return true;
        }
        if (node.members.length === 0) {
            return false;
        }

        if (this.classDeclaresConstructorProperties(node)) {
            return true;
        }

        return this.classDeclaresInstanceData(node);
    }

    private classDeclaresInstanceData(node: ts.ClassDeclaration): boolean {
        return Utils.exists(node.members, (classElement: ts.ClassElement): boolean => {
            if (classElement.kind === ts.SyntaxKind.Constructor) {
                return false;
            }
            if (AstUtils.isStatic(classElement)) {
                return false;
            }
            return true;
        });
    }

    private classDeclaresConstructorProperties(node: ts.ClassDeclaration): boolean {
        return Utils.exists(node.members, (element: ts.ClassElement): boolean => {
            if (element.kind === ts.SyntaxKind.Constructor) {
                return this.constructorDeclaresProperty(<ts.ConstructorDeclaration>element);
            }
            return false;
        });
    }

    private constructorDeclaresProperty(ctor: ts.ConstructorDeclaration): boolean {
        return Utils.exists(ctor.parameters, (param: ts.ParameterDeclaration): boolean => {
            return AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.PublicKeyword)
                || AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.PrivateKeyword)
                || AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.ProtectedKeyword)
                || AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.ReadonlyKeyword);
        });
    }

    private classExtendsSomething(node: ts.ClassDeclaration): boolean {
        return Utils.exists(node.heritageClauses, (clause: ts.HeritageClause): boolean => {
            return clause.token === ts.SyntaxKind.ExtendsKeyword;
        });
    }
}
