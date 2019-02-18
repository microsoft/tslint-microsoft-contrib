import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { Utils } from './utils/Utils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

const PROPS_REGEX = 'props-interface-regex';
const STATE_REGEX = 'state-interface-regex';

const FAILURE_UNUSED_PROP: string = 'Unused React property defined in interface: ';
const FAILURE_UNUSED_STATE: string = 'Unused React state defined in interface: ';

interface Options {
    propsInterfaceRegex: RegExp;
    stateInterfaceRegex: RegExp;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-unused-props-and-state',
        type: 'maintainability',
        description: 'Remove unneeded properties defined in React Props and State interfaces',
        options: null, // tslint:disable-line:no-null-keyword
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
            return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
        } else {
            return [];
        }
    }

    private parseOptions(options: Lint.IOptions): Options {
        const parsed = {
            propsInterfaceRegex: /^Props$/,
            stateInterfaceRegex: /^State$/
        };

        options.ruleArguments.forEach((opt: unknown) => {
            if (isObject(opt)) {
                parsed.propsInterfaceRegex = this.getOptionOrDefault(opt, PROPS_REGEX, parsed.propsInterfaceRegex);
                parsed.stateInterfaceRegex = this.getOptionOrDefault(opt, STATE_REGEX, parsed.stateInterfaceRegex);
            }
        });

        return parsed;
    }

    private getOptionOrDefault(option: { [key: string]: unknown }, key: string, defaultValue: RegExp): RegExp {
        try {
            const value: unknown = option[key];
            if (value !== undefined && typeof value === 'string') {
                return new RegExp(value);
            }
        } catch (e) {
            /* tslint:disable:no-console */
            console.error('Could not read ' + key + ' within react-unused-props-and-state-name configuration');
            /* tslint:enable:no-console */
        }
        return defaultValue;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    let propNames: string[] = [];
    let propNodes: { [index: string]: ts.TypeElement } = {};
    let stateNames: string[] = [];
    let stateNodes: { [index: string]: ts.TypeElement } = {};
    const classDeclarations: ts.ClassDeclaration[] = [];
    const arrowFunctions: ts.ArrowFunction[] = [];
    const functionComponents: ts.FunctionBody[] = [];
    let propsAlias: string | undefined;
    let stateAlias: string | undefined;

    function getTypeElementData(node: ts.InterfaceDeclaration): { [index: string]: ts.TypeElement } {
        const result: { [index: string]: ts.TypeElement } = {};
        node.members.forEach(
            (typeElement: ts.TypeElement): void => {
                if (typeElement.name !== undefined) {
                    const text = typeElement.name.getText();
                    if (text !== undefined) {
                        result[text] = typeElement;
                    }
                }
            }
        );
        return result;
    }

    function isParentNodeSuperCall(node: ts.Node): boolean {
        if (node.parent !== undefined && node.parent.kind === ts.SyntaxKind.CallExpression) {
            const call: ts.CallExpression = <ts.CallExpression>node.parent;
            return call.expression.getText() === 'super';
        }
        return false;
    }

    function cb(node: ts.Node): void {
        // Accumulate class declarations here and only analyze
        // them *after* all interfaces have been analyzed.
        if (tsutils.isClassDeclaration(node)) {
            classDeclarations.push(node);
            return;
        }

        // Props can be aliased to some other name within the constructor.
        if (tsutils.isConstructorDeclaration(node)) {
            if (node.parameters.length > 0) {
                propsAlias = (<ts.Identifier>node.parameters[0].name).text;
            }
            ts.forEachChild(node, cb);
            propsAlias = undefined;
            return;
        }

        if (tsutils.isMethodDeclaration(node)) {
            const methodName: string = (<ts.Identifier>node.name).text;
            if (
                /componentWillReceiveProps|shouldComponentUpdate|componentWillUpdate|componentDidUpdate/.test(methodName) &&
                node.parameters.length > 0
            ) {
                propsAlias = (<ts.Identifier>node.parameters[0].name).text;
            }
            if (/shouldComponentUpdate|componentWillUpdate|componentDidUpdate/.test(methodName) && node.parameters.length > 1) {
                stateAlias = (<ts.Identifier>node.parameters[1].name).text;
            }
            ts.forEachChild(node, cb);
            propsAlias = undefined;
            stateAlias = undefined;
            return;
        }

        // For all other node types, we can walk the children as the
        // last thing we do, so we don't need any special handling.
        if (tsutils.isInterfaceDeclaration(node)) {
            if (ctx.options.propsInterfaceRegex.test(node.name.text)) {
                propNodes = getTypeElementData(node);
                propNames = Object.keys(propNodes);
            }
            if (ctx.options.stateInterfaceRegex.test(node.name.text)) {
                stateNodes = getTypeElementData(node);
                stateNames = Object.keys(stateNodes);
            }
        } else if (tsutils.isPropertyAccessExpression(node)) {
            const referencedPropertyName: string = node.getText();
            if (/this\.props\..*/.test(referencedPropertyName)) {
                propNames = Utils.remove(propNames, referencedPropertyName.substring(11));
            } else if (/this\.state\..*/.test(referencedPropertyName)) {
                stateNames = Utils.remove(stateNames, referencedPropertyName.substring(11));
            }
            if (propsAlias !== undefined) {
                if (new RegExp(propsAlias + '\\..*').test(referencedPropertyName)) {
                    propNames = Utils.remove(propNames, referencedPropertyName.substring(propsAlias.length + 1));
                }
            }
            if (stateAlias !== undefined) {
                if (new RegExp(stateAlias + '\\..*').test(referencedPropertyName)) {
                    stateNames = Utils.remove(stateNames, referencedPropertyName.substring(stateAlias.length + 1));
                }
            }
            if (node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                if (referencedPropertyName === 'this.props') {
                    // this props reference has escaped the function
                    propNames = [];
                } else if (referencedPropertyName === 'this.state') {
                    // this state reference has escaped the function
                    stateNames = [];
                }
            }
        } else if (tsutils.isIdentifier(node)) {
            if (propsAlias !== undefined) {
                if (
                    node.text === propsAlias &&
                    node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression &&
                    node.parent.kind !== ts.SyntaxKind.Parameter &&
                    isParentNodeSuperCall(node) === false
                ) {
                    // this props reference has escaped the constructor
                    propNames = [];
                }
            }
            if (stateAlias !== undefined) {
                if (
                    node.text === stateAlias &&
                    node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression &&
                    node.parent.kind !== ts.SyntaxKind.Parameter
                ) {
                    // this state reference has escaped the constructor
                    stateNames = [];
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    ts.forEachChild(ctx.sourceFile, cb);

    // If there are Props or State interfaces, then scan the classes now.
    if (propNames.length > 0 || stateNames.length > 0) {
        classDeclarations.forEach(c => ts.forEachChild(c, cb));
        arrowFunctions.forEach(c => ts.forEachChild(c.body, cb));
        functionComponents.forEach(f => ts.forEachChild(f, cb));
    }

    propNames.forEach(
        (propName): void => {
            const typeElement: ts.TypeElement = propNodes[propName];
            ctx.addFailureAt(typeElement.getStart(), typeElement.getWidth(), FAILURE_UNUSED_PROP + propName);
        }
    );

    stateNames.forEach(
        (stateName): void => {
            const typeElement: ts.TypeElement = stateNodes[stateName];
            ctx.addFailureAt(typeElement.getStart(), typeElement.getWidth(), FAILURE_UNUSED_STATE + stateName);
        }
    );
}
