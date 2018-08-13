import * as ts from 'typescript';
import { isJsxElement } from '../TypeGuard';

/**
 * @Returns the implicit role for an li tag.
 */
function getImplicitRoleForLi(node: ts.Node): string | undefined {
    const parentNode: ts.Node = node.parent;
    let parentTagName: string | undefined;

    if (isJsxElement(parentNode)) {
        parentTagName = parentNode.openingElement.tagName.getText();
    }

    return (parentTagName === 'ol' || parentTagName === 'ul') ? 'listitem' : undefined;
}

export { getImplicitRoleForLi as li };
