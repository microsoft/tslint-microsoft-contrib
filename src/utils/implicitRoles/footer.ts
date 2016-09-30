import * as ts from 'typescript';
import { getAncestorNode } from '../JsxAttribute';

/**
 * @Returns the implicit role for a footer tag.
 */
function getImplicitRoleForFooter(node: ts.Node): string {
    return getAncestorNode(node, 'article') || getAncestorNode(node, 'section') ? undefined : 'contentinfo';
}

export { getImplicitRoleForFooter as footer };
