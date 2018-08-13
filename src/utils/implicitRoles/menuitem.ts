import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const typeString: string = 'type';

/**
 * @Returns the implicit role for a menuitem tag.
 */
function getImplicitRoleForMenuitem(node: ts.Node): string | undefined {
    const typeAttribute: ts.JsxAttribute = getJsxAttributesFromJsxElement(node)[typeString];

    if (typeAttribute) {
        const value = getStringLiteral(typeAttribute) || '';

        switch (value.toUpperCase()) {
            case 'COMMAND':
                return 'menuitem';
            case 'CHECKBOX':
                return 'menuitemcheckbox';
            case 'RADIO':
                return 'menuitemradio';
            default:
                return undefined;
        }
    }

    return undefined;
}

export { getImplicitRoleForMenuitem as menuitem };
