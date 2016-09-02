import * as ts from 'typescript';
import * as implicitRoles from './implicitRoles';
import { isJsxElement, isJsxSelfClosingElement } from './TypeGuard';

/**
 * @returns the implicit role for a JsxElement, JsxSelfClosingElement or JsxOpeningElement.
 * The implementation is inspired and re-implemented from
 * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/src/util/getImplicitRole.js
 */
export function getImplicitRole(node: ts.Node): string {
  let tagName: string;

  if (isJsxElement(node)) {
    tagName = node.openingElement.tagName.getText();
  } else if (isJsxSelfClosingElement(node)) {
    tagName = node.tagName.getText();
  } else {
    tagName = undefined;
  }

  return tagName && implicitRoles[tagName.toUpperCase()] && implicitRoles[tagName.toUpperCase()](node);
}
