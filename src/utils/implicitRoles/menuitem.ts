import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const typeString: string = 'type';

/**
 * @Returns the implicit role for a menuitem tag.
 */
function getImplicitRoleForMenuitem(node: ts.Node): string {
  const type: ts.JsxAttribute = getJsxAttributesFromJsxElement(node)[typeString];

  if (type) {
    const value: string = getStringLiteral(type) || '';

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

export { getImplicitRoleForMenuitem as MENUITEM };
