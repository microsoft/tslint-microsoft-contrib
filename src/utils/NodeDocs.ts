/*!
 * Copyright Microsoft Corporation. All rights reserved.
 */

import * as tsutils from "tsutils";
import * as ts from "typescript";

/**
 * Node types that may include a name identifier.
 */
type INodeWithNameIdentifier = ts.Node & {
    name?: Partial<ts.Identifier>;
};

/**
 * Syntax kind identifiers for node types that may include a name identifier.
 */
const nodeKindsWithNameIdentifiers = new Set([
    ts.SyntaxKind.ClassDeclaration,
    ts.SyntaxKind.EnumDeclaration,
    ts.SyntaxKind.FunctionDeclaration,
    ts.SyntaxKind.GetAccessor,
    ts.SyntaxKind.InterfaceDeclaration,
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.ModuleDeclaration,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.SetAccessor,
    ts.SyntaxKind.TypeAliasDeclaration,
    ts.SyntaxKind.VariableStatement
]);

/**
 * @returns Name text of a node's name identifier, if it exists.
 */
const getNodeWithOptionalIdentifierName = (node: INodeWithNameIdentifier): string | undefined => {
    const { name } = node;

    return name === undefined ? undefined : name.text;
};

/**
 * @returns Whether this variable declaration is the first in its list.
 */
const variableIsAfterFirstInDeclarationList = (node: ts.VariableDeclaration): boolean => {
    const parent = node.parent;
    if (parent === undefined) {
        return false;
    }

    return ts.isVariableDeclarationList(parent) && node !== parent.declarations[0];
};

/**
 * @returns JSDoc that appears to be attached to a node, if one exists.
 * @see https://github.com/ajafff/tsutils/issues/16
 */
export const getApparentJsDoc = (node: ts.Node): ts.JSDoc[] | undefined => {
    if (ts.isVariableDeclaration(node)) {
        if (variableIsAfterFirstInDeclarationList(node)) {
            return undefined;
        }

        node = node.parent;
    }

    if (ts.isVariableDeclarationList(node)) {
        node = node.parent;
    }

    return tsutils.getJsDoc(node);
};

/**
 * @returns Name text of a node, if it contains a name identifier.
 */
export const getNodeName = (node: ts.Node): string | undefined => {
    return nodeKindsWithNameIdentifiers.has(node.kind) ? getNodeWithOptionalIdentifierName(<INodeWithNameIdentifier>node) : undefined;
};
