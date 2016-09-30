import * as ts from 'typescript';
import { getAncestorNode } from '../JsxAttribute';

/**
 * @Returns the implicit role for a header tag.
 */
function getImplicitRoleForHeader(node: ts.Node): string {
    return getAncestorNode(node, 'article') || getAncestorNode(node, 'section') ? undefined : 'banner';
}

export { getImplicitRoleForHeader as header };
