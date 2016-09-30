import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const typeString: string = 'type';
const listString: string = 'list';

/**
 * @Returns the implicit role for an input tag.
 */
function getImplicitRoleForInput(node: ts.Node): string {
    const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
    const typeAttribute: ts.JsxAttribute = attributes[typeString];

    if (typeAttribute) {
        const value: string = getStringLiteral(typeAttribute) || '';

        // tslint:disable:no-switch-case-fall-through
        switch (value.toUpperCase()) {
            case 'BUTTON':
            case 'IMAGE':
            case 'RESET':
            case 'SUBMIT':
                return 'button';
            case 'CHECKBOX':
                return 'checkbox';
            case 'NUMBER':
                return 'spinbutton';
            case 'PASSWORD':
                return 'textbox';
            case 'RADIO':
                return 'radio';
            case 'RANGE':
                return 'slider';
            case 'SEARCH':
                return attributes[listString] ? 'combobox' : 'searchbox';
            case 'EMAIL':
            case 'TEL':
            case 'URL':
            case 'TEXT':
                return attributes[listString] ? 'combobox' : 'textbox';
            case 'COLOR':
            case 'DATE':
            case 'DATETIME':
            case 'FILE':
            case 'HIDDEN':
            case 'MONTH':
            case 'TIME':
            case 'WEEK':
                return undefined;
            default:
                return 'textbox';
        }
    }
    // tslint:enable:no-switch-case-fall-through

    return 'textbox';
}

export { getImplicitRoleForInput as input };
