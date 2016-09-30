import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement } from '../JsxAttribute';

const hrefString: string = 'href';

/**
 * @Returns the implicit role for an anchor tag.
 */
function getImplicitRoleForAnchor(node: ts.Node): string {
    return getJsxAttributesFromJsxElement(node)[hrefString] ? 'link' : undefined;
}

export { getImplicitRoleForAnchor as a };
