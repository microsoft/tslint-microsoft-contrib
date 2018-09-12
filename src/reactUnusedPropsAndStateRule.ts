import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const PROPS_REGEX = 'props-interface-regex';
const STATE_REGEX = 'state-interface-regex';

const FAILURE_UNUSED_PROP: string = 'Unused React property defined in interface: ';
const FAILURE_UNUSED_STATE: string = 'Unused React state defined in interface: ';

/**
 * Implementation of the react-unused-props-and-state rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-unused-props-and-state',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Remove unneeded properties defined in React Props and State interfaces',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactUnusedPropsAndStateRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactUnusedPropsAndStateRuleWalker extends ErrorTolerantWalker {

    private propNames: string[] = [];
    private propNodes: { [index: string]: ts.TypeElement } = {};
    private stateNames: string[] = [];
    private stateNodes: { [index: string]: ts.TypeElement } = {};
    private classDeclarations: ts.ClassDeclaration[] = [];
    private propsAlias: string | undefined;
    private stateAlias: string | undefined;
    private propsInterfaceRegex: RegExp = /^Props$/;
    private stateInterfaceRegex: RegExp = /^State$/;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                this.propsInterfaceRegex = this.getOptionOrDefault(opt, PROPS_REGEX, this.propsInterfaceRegex);
                this.stateInterfaceRegex = this.getOptionOrDefault(opt, STATE_REGEX, this.stateInterfaceRegex);
            }
        });
    }

    private getOptionOrDefault(option: any, key: string, defaultValue: RegExp): RegExp {
        try {
            if (option[key] != null) {
                return new RegExp(option[key]);
            }
        } catch (e) {
            /* tslint:disable:no-console */
            console.error('Could not read ' + key + ' within react-unused-props-and-state-name configuration');
            /* tslint:enable:no-console */
        }
        return defaultValue;
    }

    protected visitSourceFile(node: ts.SourceFile): void {

        super.visitSourceFile(node);

        // if no Props or State interface is declared then don't bother scanning the class
        if (this.propNames.length > 0 || this.stateNames.length > 0) {
            this.classDeclarations.forEach(this.walkChildren, this);
        }

        this.propNames.forEach((propName: string): void => {
            const typeElement: ts.TypeElement = this.propNodes[propName];
            this.addFailureAt(typeElement.getStart(), typeElement.getWidth(), FAILURE_UNUSED_PROP + propName);
        });
        this.stateNames.forEach((stateName: string): void => {
            const typeElement: ts.TypeElement = this.stateNodes[stateName];
            this.addFailureAt(typeElement.getStart(), typeElement.getWidth(), FAILURE_UNUSED_STATE + stateName);
        });
    }

    /**
     * Accumulate class declarations here and only analyze them *after* all interfaces have been analyzed.
     */
    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.classDeclarations.push(node);
    }

    protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        if (this.propsInterfaceRegex.test(node.name.text)) {
            this.propNodes = this.getTypeElementData(node);
            this.propNames = Object.keys(this.propNodes);
        }
        if (this.stateInterfaceRegex.test(node.name.text)) {
            this.stateNodes = this.getTypeElementData(node);
            this.stateNames = Object.keys(this.stateNodes);
        }
        super.visitInterfaceDeclaration(node);
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        const referencedPropertyName: string = node.getText();
        if (/this\.props\..*/.test(referencedPropertyName)) {
            this.propNames = Utils.remove(this.propNames, referencedPropertyName.substring(11));
        } else if (/this\.state\..*/.test(referencedPropertyName)) {
            this.stateNames = Utils.remove(this.stateNames, referencedPropertyName.substring(11));
        }
        if (this.propsAlias != null) {
            if (new RegExp(this.propsAlias + '\\..*').test(referencedPropertyName)) {
                this.propNames = Utils.remove(this.propNames, referencedPropertyName.substring(this.propsAlias.length + 1));
            }
        }
        if (this.stateAlias != null) {
            if (new RegExp(this.stateAlias + '\\..*').test(referencedPropertyName)) {
                this.stateNames = Utils.remove(this.stateNames, referencedPropertyName.substring(this.stateAlias.length + 1));
            }
        }
        if (node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            if (referencedPropertyName === 'this.props') {
                // this props reference has escaped the function
                this.propNames = [];
            } else if (referencedPropertyName === 'this.state') {
                // this state reference has escaped the function
                this.stateNames = [];
            }
        }
        super.visitPropertyAccessExpression(node);
    }

    protected visitIdentifier(node: ts.Identifier): void {
        if (this.propsAlias != null) {
            if (node.text === this.propsAlias
                && node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression
                && node.parent.kind !== ts.SyntaxKind.Parameter
                && this.isParentNodeSuperCall(node) === false) {
                // this props reference has escaped the constructor
                this.propNames = [];
            }

        }
        if (this.stateAlias != null) {
            if (node.text === this.stateAlias
                && node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression
                && node.parent.kind !== ts.SyntaxKind.Parameter) {
                // this state reference has escaped the constructor
                this.stateNames = [];
            }

        }
        super.visitIdentifier(node);
    }

    /**
     * Props can be aliased to some other name within the constructor.
     */
    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        if (node.parameters.length > 0) {
            this.propsAlias = (<ts.Identifier>node.parameters[0].name).text;
        }
        super.visitConstructorDeclaration(node);
        this.propsAlias = undefined;
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        const methodName: string = (<ts.Identifier>node.name).text;
        if (/componentWillReceiveProps|shouldComponentUpdate|componentWillUpdate|componentDidUpdate/.test(methodName)
                && node.parameters.length > 0) {
            this.propsAlias = (<ts.Identifier>node.parameters[0].name).text;
        }
        if (/shouldComponentUpdate|componentWillUpdate|componentDidUpdate/.test(methodName)
                && node.parameters.length > 1) {
            this.stateAlias = (<ts.Identifier>node.parameters[1].name).text;
        }
        super.visitMethodDeclaration(node);
        this.propsAlias = undefined;
        this.stateAlias = undefined;
    }

    private getTypeElementData(node: ts.InterfaceDeclaration): { [index: string]: ts.TypeElement } {
        const result: { [index: string]: ts.TypeElement } = {};
        node.members.forEach((typeElement: ts.TypeElement): void => {
            if (typeElement.name != null && (<any>typeElement.name).text != null) {
                result[(<any>typeElement.name).text] = typeElement;
            }
        });
        return result;
    }

    private isParentNodeSuperCall(node: ts.Node): boolean {
        if (node.parent != null && node.parent.kind === ts.SyntaxKind.CallExpression) {
            const call: ts.CallExpression = <ts.CallExpression>node.parent;
            return call.expression.getText() === 'super';
        }
        return false;
    }
}
