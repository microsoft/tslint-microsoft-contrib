import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const typeString: string = 'type';

/**
 * @Returns the implicit role for a menu tag.
 */
function getImplicitRoleForMenu(node: ts.Node): string | undefined {
    const typeAttribute: ts.JsxAttribute = getJsxAttributesFromJsxElement(node)[typeString];

    if (typeAttribute) {
        const value = getStringLiteral(typeAttribute) || undefined;

        return value && value.toUpperCase() === 'TOOLBAR' ? 'toolbar' : undefined;
    }

    return undefined;
}

export { getImplicitRoleForMenu as menu };
