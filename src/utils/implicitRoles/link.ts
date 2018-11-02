import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement } from '../JsxAttribute';

const hrefString: string = 'href';

/**
 * @Returns the implicit role for a link tag.
 */
function getImplicitRoleForLink(node: ts.Node): string | undefined {
    return getJsxAttributesFromJsxElement(node)[hrefString] ? 'link' : undefined;
}

export { getImplicitRoleForLink as link };
