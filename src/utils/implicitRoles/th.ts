/**
 * @Returns the implicit role for a th tag.
 * The implicit role is columnheader or rowheader, the func only return columnheader.
 */
function getImplicitRoleForTh(): string {
    return 'columnheader';
}

export { getImplicitRoleForTh as th };
