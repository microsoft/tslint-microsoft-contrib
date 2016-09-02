/**
 * @copyright Microsoft Corporation. All rights reserved.
 *
 * @JsxAttribute utilities for react rules.
 */

import * as ts from 'typescript';
import {
  isJsxAttribute,
  isJsxExpression,
  isStringLiteral,
  isNumericLiteral,
  isJsxElement,
  isJsxSelfClosingElement,
  isJsxOpeningElement
} from './TypeGuard';

export function getPropName(node: ts.JsxAttribute): string {
  if (!isJsxAttribute(node)) {
    throw new Error('The node must be a JsxAttribute collected by the AST parser.');
  }

  return node.name
    ? node.name.text
    : undefined;
}

/**
 * Get the string literal in jsx attribute initializer with following format:
 * @example
 * <div attribute='StringLiteral' />
 * @example
 * <div attribute={ 'StringLiteral' } />
 */
export function getStringLiteral(node: ts.JsxAttribute): string {
  if (!isJsxAttribute(node)) {
    throw new Error('The node must be a JsxAttribute collected by the AST parser.');
  }

  const initializer: ts.Expression = node.initializer;

  if (!initializer) { // <tag attribute/>
    return '';
  } else if (isStringLiteral(initializer)) { // <tag attribute='value' />
    return initializer.text.trim();
  } else if (isJsxExpression(initializer) && isStringLiteral(initializer.expression)) { // <tag attribute={'value'} />
    return (<ts.StringLiteral>initializer.expression).text;
  } else if (isJsxExpression(initializer) && !initializer.expression) { // <tag attribute={} />
    return '';
  } else {
    return undefined;
  }
}

/**
 * Get the numeric literal in jsx attribute initializer with following format:
 * @example
 * <div attribute={ 1 } />
 */
export function getNumericLiteral(node: ts.JsxAttribute): string {
  if (!isJsxAttribute(node)) {
    throw new Error('The node must be a JsxAttribute collected by the AST parser.');
  }

  const initializer: ts.Expression = node.initializer;

  return isJsxExpression(initializer) && isNumericLiteral(initializer.expression)
    ? (<ts.LiteralExpression>initializer.expression).text
    : undefined;
}

/**
 * Get an array of attributes in the given node.
 * It contains JsxAttribute and JsxSpreadAttribute.
 */
export function getAllAttributesFromJsxElement(node: ts.Node): (ts.JsxAttribute | ts.JsxSpreadAttribute)[] {
  let attributes: (ts.JsxAttribute | ts.JsxSpreadAttribute)[];

  if (isJsxElement(node)) {
    attributes = node.openingElement.attributes;
  } else if (isJsxSelfClosingElement(node)) {
    attributes = node.attributes;
  } else if (isJsxOpeningElement(node)) {
    attributes = node.attributes;
  } else {
    throw new Error('The node must be a JsxElement, JsxSelfClosingElement or JsxOpeningElement.');
  }

  return attributes;
}

/**
 * Get a dictionary of JsxAttribute from a JsxElement, JsxSelfClosingElement or JsxOpeningElement.
 * @returns { [propName: string]: ts.JsxAttribute } a dictionary has lowercase keys.
 */
export function getJsxAttributesFromJsxElement(node: ts.Node): { [propName: string]: ts.JsxAttribute } {
  const attributesDictionary: { [propName: string]: ts.JsxAttribute } = {};

  getAllAttributesFromJsxElement(node).forEach((attr) => {
    if (isJsxAttribute(attr)) {
      attributesDictionary[getPropName(attr).toLowerCase()] = attr;
    }
  });

  return attributesDictionary;
}
