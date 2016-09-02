import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const typeString: string = 'type';

/**
 * @Returns the implicit role for a menu tag.
 */
function getImplicitRoleForMenu(node: ts.Node): string {
  const typeProp: ts.JsxAttribute = getJsxAttributesFromJsxElement(node)[typeString];

  if (typeProp) {
    const value: string = getStringLiteral(typeProp) || undefined;

    return (value && value.toUpperCase() === 'TOOLBAR') ? 'toolbar' : undefined;
  }

  return undefined;
}

export { getImplicitRoleForMenu as MENU };
