/**
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
import {SyntaxKind} from './SyntaxKind';

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

  const initializer: ts.Expression = node == null ? null : node.initializer;

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

export function isEmpty(node: ts.JsxAttribute): boolean {
  const initializer: ts.Expression = node == null ? null : node.initializer;

  if (initializer == null) {
    return true;
  } else if (isStringLiteral(initializer)) {
    return initializer.text.trim() === '';
  } else if (initializer.kind === SyntaxKind.current().Identifier) {
    return initializer.getText() === 'undefined';
  } else if (initializer.kind === SyntaxKind.current().NullKeyword) {
    return true;
  } else if ((<any>initializer).expression != null) {
    const expression: ts.Expression = (<any>initializer).expression;
    if (expression.kind === SyntaxKind.current().Identifier) {
      return expression.getText() === 'undefined';
    } else if (expression.kind === SyntaxKind.current().NullKeyword) {
      return true;
    }
  }
  return false;
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

  const initializer: ts.Expression = node == null ? null : node.initializer;

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

  if (node == null) {
    return [];
  } else if (isJsxElement(node)) {
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

/**
 * Get first JsxElement whose tagName equals tagName from code.
 * @param code - a string of jsx code.
 * @param exceptTagName - the element's tagName you want to get.
 * @return { ts.JsxElement | ts.JsxSelfClosingElement } - a element.
 */
export function getJsxElementFromCode(code: string, exceptTagName: string): ts.JsxElement | ts.JsxSelfClosingElement {
  const sourceFile: ts.SourceFile = ts.createSourceFile('test.tsx', code, ts.ScriptTarget.ES6, true);

  return delintNode(sourceFile, exceptTagName);
}

function delintNode(node: ts.Node, tagName: string): ts.JsxElement | ts.JsxSelfClosingElement {
  if (isJsxElement(node) && node.openingElement.tagName.getText() === tagName) {
    return node;
  } else if (isJsxSelfClosingElement(node) && node.tagName.getText() === tagName) {
    return node;
  } else if (!node || node.getChildCount() === 0) {
    return undefined;
  }

  return ts.forEachChild(node, (childNode: ts.Node) => delintNode(childNode, tagName));
}

/**
 * Get ancestor node whose tagName is ancestorTagName for a node.
 * @return { ts.JsxElement } the ancestor node or undefined if the ancestor node is not exist.
 */
export function getAncestorNode(node: ts.Node, ancestorTagName: string): ts.JsxElement {
  if (!node) {
    return undefined;
  }

  const ancestorNode: ts.Node = node.parent;

  if (isJsxElement(ancestorNode) && ancestorNode.openingElement.tagName.getText() === ancestorTagName) {
    return ancestorNode;
  } else {
    return getAncestorNode(ancestorNode, ancestorTagName);
  }
}
