import * as ts from "typescript";
import * as Lint from "tslint";

import { AstUtils } from "./utils/AstUtils";
import { ExtendedMetadata } from "./utils/ExtendedMetadata";

const FAILURE_STRING: string = "Found as-cast instead of a traditional type-cast. Please convert to a type-cast: ";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: "prefer-type-cast",
        type: "maintainability",
        description: "Prefer the tradition type casts instead of the new 'as-cast' syntax",
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: "Ignored",
        issueType: "Warning",
        severity: "Low",
        level: "Opportunity for Excellence",
        group: "Configurable",
        recommendation: "true,   // pick either type-cast format and use it consistently",
        commonWeaknessEnumeration: "398, 710"
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferTypeCastRuleWalker(sourceFile, this.getOptions()));
    }
}

class PreferTypeCastRuleWalker extends Lint.RuleWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (AstUtils.getLanguageVariant(node) === ts.LanguageVariant.Standard) {
            super.visitSourceFile(node);
        }
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.AsExpression) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
        }
        super.visitNode(node);
    }
}
