import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

/*
 * TSX curly spacing rule.
 *
 * This is inspired by https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/jsx-curly-spacing.js
 * See the options in https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
 */
export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new TsxCurlySpacingWalker(sourceFile, this.getOptions()));
  }
}

class TsxCurlySpacingWalker extends Lint.RuleWalker {
  private _sourceFile: ts.SourceFile;
  private _space: boolean;
  private _multiline: boolean;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    this._sourceFile = sourceFile;
    this._space = options.ruleArguments[0] === 'always';
    this._multiline = options.ruleArguments[1] ? options.ruleArguments[1].allowMultiline : true;
  }

  public visitJsxExpression(node: ts.JsxExpression): void {
    const childrenCount: number = node.getChildCount();
    const first: ts.Node = node.getFirstToken(); // '{' sign
    const last: ts.Node = node.getLastToken(); // '}' sign
    const second: ts.Node = node.getChildAt(1); // after '{' sign
    const penultimate: ts.Node = node.getChildAt(childrenCount - 2); // before '}' sign
    this.validateBraceSpacing(node, first, second, penultimate, last);
  }

  protected visitNode(node: ts.Node): void {
    // This is hacked to visit JSX Expression. See https://github.com/palantir/tslint/pull/1292
    if (node.kind === ts.SyntaxKind.JsxExpression) {
      this.visitJsxExpression(<ts.JsxExpression> node);
      this.walkChildren(node);
    } else {
      super.visitNode(node);
    }
  }

  private validateBraceSpacing(
    node: ts.Node, first: ts.Node, second: ts.Node, penultimate: ts.Node, last: ts.Node
  ): void {
    if (this._space) { // always space
      if (!this.isSpaceBetweenTokens(first, second)) {
        this.reportFailure(node, first, `A space is required after '${first.getText()}'`);
      } else if (!this._multiline && this.isMultiline(first, second)) {
        this.reportFailure(node, first, `There should be no newline after '${first.getText()}'`);
      }

      if (!this.isSpaceBetweenTokens(penultimate, last)) {
        this.reportFailure(node, last, `A space is required before '${last.getText()}'`);
      } else if (!this._multiline && this.isMultiline(penultimate, last)) {
        this.reportFailure(node, last, `There should be no newline before '${last.getText()}'`);
      }
    } else { // never space
      if (this.isSpaceBetweenTokens(first, second) && !(this._multiline && this.isMultiline(first, second))) {
        this.reportFailure(node, first, `There should be no space after '${first.getText()}'`);
      }

      if (this.isSpaceBetweenTokens(penultimate, last) && !(this._multiline && this.isMultiline(penultimate, last))) {
        this.reportFailure(node, last, `There should be no space before '${last.getText()}'`);
      }
    }
  }

  private reportFailure(node: ts.Node, end: ts.Node, failure: string): void {
    this.addFailure(this.createFailure(node.getStart(), end.getStart() - node.getStart(), failure));
  }

  private isSpaceBetweenTokens(left: ts.Node, right: ts.Node): boolean {
    // Inspired from https://github.com/eslint/eslint/blob/master/lib/util/source-code.js#L296
    const text: string = this._sourceFile.getText().slice(left.getEnd(), right.getStart());
    return /\s/.test(text.replace(/\/\*.*?\*\//g, ''));
  }

  private isMultiline(left: ts.Node, right: ts.Node): boolean {
    const leftLine: number = this._sourceFile.getLineAndCharacterOfPosition(left.getStart()).line;
    const rightLine: number = this._sourceFile.getLineAndCharacterOfPosition(right.getStart()).line;
    return leftLine !== rightLine;
  }
}
