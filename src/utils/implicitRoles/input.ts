import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const typeString: string = 'type';

/**
 * @Returns the implicit role for an input tag.
 */
function getImplicitRoleForInput(node: ts.Node): string {
  const typeProp: ts.JsxAttribute = getJsxAttributesFromJsxElement(node)[typeString];

  if (typeProp) {
    const value: string = getStringLiteral(typeProp) || '';

    /* tslint:disable:no-switch-case-fall-through */
    switch (value.toUpperCase()) {
      case 'BUTTON':
      case 'IMAGE':
      case 'RESET':
      case 'SUBMIT':
        return 'button';
      case 'CHECKBOX':
        return 'checkbox';
      case 'RADIO':
        return 'radio';
      case 'RANGE':
        return 'slider';
      case 'EMAIL':
      case 'PASSWORD':
      case 'SEARCH': // with [list] selector it's combobox
      case 'TEL': // with [list] selector it's combobox
      case 'URL': // with [list] selector it's combobox
      default:
        return 'textbox';
    }
  }
  /* tslint:enable:no-switch-case-fall-through */

  return 'textbox';
}

export { getImplicitRoleForInput as INPUT };
