import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'import-name',
        type: 'maintainability',
        description: 'The name of the imported module must match the name of the thing being imported',
        hasFix: true,
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ImportNameRuleWalker(sourceFile, this.getOptions()));
    }
}

class ImportNameRuleWalker extends ErrorTolerantWalker {

    private replacements: { [index: string]: string; };

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.replacements = this.extractOptions();
    }

    private extractOptions(): { [index: string]: string; } {
        const result : { [index: string]: string; } = {};
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                Object.keys(opt).forEach((key: string): void => {
                    const value: any = opt[key];
                    if (typeof value === 'string') {
                        result[key] = value;
                    }
                });
            }
        });
        return result;
    }

    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        const name: string = node.name.text;

        if (node.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
            const moduleRef: ts.ExternalModuleReference = <ts.ExternalModuleReference>node.moduleReference;
            if (moduleRef.expression.kind === ts.SyntaxKind.StringLiteral) {
                const moduleName: string = (<ts.StringLiteral>moduleRef.expression).text;
                this.validateImport(node, name, moduleName);
            }
        } else if (node.moduleReference.kind === ts.SyntaxKind.QualifiedName) {
            let moduleName = node.moduleReference.getText();
            moduleName = moduleName.replace(/.*\./, ''); // chop off the qualified parts
            this.validateImport(node, name, moduleName);
        }
        super.visitImportEqualsDeclaration(node);
    }

    protected visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (node.importClause!.name != null) {
            const name: string = node.importClause!.name!.text;
            if (node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
                const moduleName: string = (<ts.StringLiteral>node.moduleSpecifier).text;
                this.validateImport(node, name, moduleName);
            }
        }
        super.visitImportDeclaration(node);
    }

    private validateImport(node: ts.ImportEqualsDeclaration | ts.ImportDeclaration, importedName: string, moduleName: string): void {
        let expectedImportedName = moduleName.replace(/.*\//, ''); // chop off the path
        expectedImportedName = this.makeCamelCase(expectedImportedName);
        if (this.isImportNameValid(importedName, expectedImportedName, moduleName) === false) {
            const message: string = `Misnamed import. Import should be named '${expectedImportedName}' but found '${importedName}'`;
            const nameNode = node.kind === ts.SyntaxKind.ImportEqualsDeclaration
                ? (<ts.ImportEqualsDeclaration>node).name
                : (<ts.ImportDeclaration>node).importClause!.name;
            const nameNodeStartPos = nameNode!.getStart();
            const fix = new Lint.Replacement(nameNodeStartPos, nameNode!.end - nameNodeStartPos, expectedImportedName);
            this.addFailureAt(node.getStart(), node.getWidth(), message, fix);
        }
    }

    private makeCamelCase(input: string): string {
        // tslint:disable-next-line:variable-name
        return input.replace(/[-|\.|_](.)/g, (_match: string, group1: string): string => {
            return group1.toUpperCase();
        });
    }

    private isImportNameValid(importedName: string, expectedImportedName: string, moduleName: string): boolean {
        if (expectedImportedName === importedName) {
            return true;
        }

        // Allowed Replacement keys are specifiers that are allowed when overriding or adding exceptions
        // to import-name rule.
        // Example: for below import statement
        // `import cgi from 'fs-util/cgi-common'`
        // The Valid specifiers are: [cgiCommon, fs-util/cgi-common, cgi-common]
        const allowedReplacementKeys: string[] = [expectedImportedName, moduleName, moduleName.replace(/.*\//, '')];
        return Utils.exists(Object.keys(this.replacements), (replacementKey: string): boolean => {
            for (let index = 0; allowedReplacementKeys.length > index; index = index + 1) {
                if (replacementKey === allowedReplacementKeys[index]) {
                    return importedName === this.replacements[replacementKey];
                }
            }
            return false;
        });
    }
}
