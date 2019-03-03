import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';
import { notDeepEqual } from 'assert';

const VIDEO_ELEMENT_NAME: string = 'video';
const AUDIO_ELEMENT_NAME: string = 'audio';
const TRACK_ELEMENT_NAME: string = 'track';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-media-captions',
        type: 'functionality',
        description: 'Enforce that video and audio elements have captions and descriptions.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node) && isMediaTypeElement(node.tagName)) {
            ctx.addFailureAtNode(node, 'mnoses');
        }
        if (tsutils.isJsxOpeningElement(node) && isMediaTypeElement(node.tagName)) {
            const hi = containsCaptions(node);
        }
        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}

function isMediaTypeElement(tagName: ts.JsxTagNameExpression): boolean {
    const elementName = tagName.getText();
    return elementName === VIDEO_ELEMENT_NAME || elementName === AUDIO_ELEMENT_NAME;
}

function containsCaptions(node: ts.Node): void {
    node.getChildren().forEach(childNode => {
        const hi = childNode;
    });
}

/*function getAttributeText(attribute: ts.JsxAttribute): string | undefined {
    if (attribute && attribute.initializer) {
        if (tsutils.isJsxExpression(attribute.initializer)) {
            return attribute.initializer.expression ? attribute.initializer.expression.getText() : undefined;
        }
        if (tsutils.isStringLiteral(attribute.initializer)) {
            return attribute.initializer.text;
        }
    }
    return undefined;
}*/
