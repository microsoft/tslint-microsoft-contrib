/**
 * @copyright Microsoft Corporation. All rights reserved.
 *
 * @a11yTabindexNoPositiveRule tslint rule of accessibility.
 */

import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import { getPropName, getStringLiteral, getNumericLiteral } from './utils/JsxAttribute';

export function getFailureString(): string {
  return `The value of 'tabindex' attribute is invalid or undefined. It must be either -1 or 0.`;
}

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return sourceFile.languageVariant === ts.LanguageVariant.JSX
      ? this.applyWithWalker(new A11yTabindexNoPositiveWalker(sourceFile, this.getOptions()))
      : [];
  }
}

class A11yTabindexNoPositiveWalker extends Lint.RuleWalker {
  public visitJsxAttribute(node: ts.JsxAttribute): void {
    const name: string = getPropName(node);

    if (!name || name.toLowerCase() !== 'tabindex') {
      return;
    }

    const literalString: string = getNumericLiteral(node) || getStringLiteral(node);

    // In case the attribute has no value of empty value.
    if (literalString === '') {
      this.addFailure(this.createFailure(
        node.getStart(),
        node.getWidth(),
        getFailureString()
      ));
    } else if (literalString && literalString !== '-1' && literalString !== '0') {
      this.addFailure(this.createFailure(
        node.getStart(),
        node.getWidth(),
        getFailureString()
      ));
    }
  }
}
