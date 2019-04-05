import * as ts from 'typescript';
import { implicitRoles } from './implicitRoles';
import { isJsxElement, isJsxSelfClosingElement, isJsxOpeningElement } from './TypeGuard';

/**
 * @returns string of the implicit role or undefined if no corresponding role for a
 * JsxElement, JsxSelfClosingElement or JsxOpeningElement.
 * The implementation is inspired and re-implemented from
 * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/src/util/getImplicitRole.js
 * A reference about implicit role: https://www.w3.org/TR/html-aria/#sec-strong-native-semantics.
 * A reference about no corresponding role: https://www.w3.org/TR/html-aria/#dfn-no-corresponding-role.
 */
export function getImplicitRole(node: ts.Node | undefined): string | undefined {
    let tagName: string | undefined;

    if (node === undefined) {
        return undefined;
    }

    if (isJsxElement(node)) {
        tagName = node.openingElement.tagName.getText();
    } else if (isJsxSelfClosingElement(node)) {
        tagName = node.tagName.getText();
    } else if (isJsxOpeningElement(node)) {
        tagName = node.tagName.getText();
    } else {
        tagName = undefined;
    }

    if (tagName === undefined || !(tagName in implicitRoles)) {
        return undefined;
    }

    return implicitRoles[tagName](node);
}
