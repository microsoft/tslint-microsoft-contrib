import * as ts from 'typescript';
import * as Lint from 'tslint';

import { getNextToken, getPreviousToken } from 'tsutils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Assigning this reference to local variable: ';

/**
 * Implementation of the no-var-self rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-var-self',
        type: 'maintainability',
        description: 'Do not use var self = this; instead, manage scope with arrow functions/lambdas.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoVarSelfRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoVarSelfRuleWalker extends Lint.RuleWalker {

    private bannedVariableNames: RegExp = /.*/; // default is to ban everything

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        if (options.ruleArguments != null && options.ruleArguments.length > 0) {
            this.bannedVariableNames = new RegExp(options.ruleArguments[0]);
        }
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (node.initializer != null && node.initializer.kind === ts.SyntaxKind.ThisKeyword) {
            if (node.name.kind === ts.SyntaxKind.Identifier) {
                const identifier: ts.Identifier = <ts.Identifier>node.name;
                if (this.bannedVariableNames.test(identifier.text)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText(),
                        new NoVarSelfFixer(node).getFixes());
                }
            }
        }
        super.visitVariableDeclaration(node);
    }
}

class NoVarSelfFixer extends Lint.SyntaxWalker {
    /** Replacements that should be applied if we don't find any problematic uses */
    private fixes: Lint.Replacement[];

    /** How many nested functions we've traversed into */
    private scopeCounter: number;

    /** Whether we found anything that prevents us from automatically renaming */
    private problemEncountered: boolean;

    /** The name of the variable that had `this` assigned to it */
    private variableName: string;

    /**
     * @param declaration The declaration that assigned from `this`
     */
    constructor(private declaration: ts.VariableDeclaration) {
        super();
        this.variableName = (declaration.name as ts.Identifier).text;
    }

    public getFixes(): Lint.Fix | undefined {
        if (this.declaration.type) {
            return undefined;
        }
        const declarationParent = this.declaration.parent!;
        if (declarationParent.kind !== ts.SyntaxKind.VariableDeclarationList || declarationParent.declarations.length !== 1) {
            return undefined;
        }
        const variableStatement = declarationParent.parent!;
        if (variableStatement.kind !== ts.SyntaxKind.VariableStatement) {
            return undefined;
        }

        // Find the containing function for that variable statement.
        // Technically we could limit this to the containing block for let/const, but let's keep it simple.
        let containingFunction: ts.Node | undefined = variableStatement;
        while (containingFunction &&
            containingFunction.kind !== ts.SyntaxKind.ArrowFunction &&
            containingFunction.kind !== ts.SyntaxKind.FunctionDeclaration &&
            containingFunction.kind !== ts.SyntaxKind.FunctionExpression &&
            containingFunction.kind !== ts.SyntaxKind.MethodDeclaration &&
            containingFunction.kind !== ts.SyntaxKind.Constructor)
        {
            containingFunction = containingFunction.parent;
        }
        if (!containingFunction) {
            return undefined;
        }

        let removalWidth = variableStatement.getFullWidth();

        // If removing the self=this line would leave us with an awkward empty line starting our function, then
        // get rid of it
        const previousToken = getPreviousToken(variableStatement);
        const nextToken = getNextToken(variableStatement);
        if (previousToken && previousToken.kind === ts.SyntaxKind.OpenBraceToken && nextToken) {
            const matches = nextToken.getFullText().match(/^(\s*?)\r?\n\S/);
            if (matches && matches[1]) {
                removalWidth += matches[1].length;
            }
        }

        this.fixes = [Lint.Replacement.deleteText(variableStatement.getFullStart(), removalWidth)];
        this.scopeCounter = 0;
        this.problemEncountered = false;

        this.walkChildren(containingFunction);

        return this.problemEncountered ? undefined : this.fixes;
    }

    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        // Check for assignment to our variable
        if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            node.left.kind === ts.SyntaxKind.Identifier &&
            (node.left as ts.Identifier).text === this.variableName) {
                this.problemEncountered = true;
            }
        super.visitBinaryExpression(node);
    }

    protected visitIdentifier(node: ts.Identifier): void {
        if (node.text === this.variableName) {
            // Check whether the variable was used within a sub-function (not arrow function)
            if (this.scopeCounter > 0) {
                this.problemEncountered = true;
            }

            // Add a replacement
            this.fixes.push(Lint.Replacement.replaceNode(node, "this"));
        }
        super.visitIdentifier(node);
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        // Don't traverse this declaration if we're already planning to remove it.
        if (node !== this.declaration) {
            // Check for redeclaration of our variable or shadowed versions in sub-functions
            if (node.name.kind === ts.SyntaxKind.Identifier && node.name.text === this.variableName) {
                this.problemEncountered = true;
            }

            super.visitVariableDeclaration(node);
        }
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        ++this.scopeCounter;
        super.visitFunctionDeclaration(node);
        --this.scopeCounter;
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        ++this.scopeCounter;
        super.visitFunctionExpression(node);
        --this.scopeCounter;
    }
}