import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement } from '../JsxAttribute';

const hrefString: string = 'href';

/**
 * @Returns the implicit role for an area tag.
 */
function getImplicitRoleForArea(node: ts.Node): string {
    return getJsxAttributesFromJsxElement(node)[hrefString] ? 'link' : undefined;
}

export { getImplicitRoleForArea as area };
