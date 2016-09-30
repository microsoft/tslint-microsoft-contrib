import * as ts from 'typescript';
import { getJsxAttributesFromJsxElement, getStringLiteral } from '../JsxAttribute';

const altString: string = 'alt';

/**
 * @Returns the implicit role for an img tag.
 */
function getImplicitRoleForImg(node: ts.Node): string {
    const alt: ts.JsxAttribute = getJsxAttributesFromJsxElement(node)[altString];

    if (alt && getStringLiteral(alt)) {
        return 'img';
    }

    return 'presentation';
}

export { getImplicitRoleForImg as img };
