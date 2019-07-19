import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getAllAttributesFromJsxElement, getStringLiteral } from './utils/JsxAttribute';

const VIDEO_ELEMENT_NAME: string = 'video';
const AUDIO_ELEMENT_NAME: string = 'audio';
const TRACK_ELEMENT_NAME: string = 'track';
const KIND_ATTRIBUTE_NAME: string = 'kind';
const CAPTIONS_KIND_NAME: string = 'captions';
const DESCRIPTION_KIND_NAME: string = 'description';
const NO_CAPTIONS_ERROR_MESSAGE: string = 'Video and audio elements must have a captions track';
const NO_AUDIO_DESCRIPTION_MESSAGE: string = 'Video elements must have an audio description track';

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
        if (tsutils.isJsxSelfClosingElement(node) && (isVideoElement(node.tagName) || isAudioElement(node.tagName))) {
            ctx.addFailureAtNode(node, NO_CAPTIONS_ERROR_MESSAGE);
        }
        if (tsutils.isJsxElement(node) && (isVideoElement(node.openingElement.tagName) || isAudioElement(node.openingElement.tagName))) {
            if (!containsTrackElementWithSpreadAttributes(node.openingElement)) {
                validateMediaType(node.openingElement, ctx);
                return;
            }
        }
        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}

function isVideoElement(tagName: ts.JsxTagNameExpression): boolean {
    const elementName = tagName.getText();
    return elementName === VIDEO_ELEMENT_NAME;
}

function isAudioElement(tagName: ts.JsxTagNameExpression): boolean {
    const elementName = tagName.getText();
    return elementName === AUDIO_ELEMENT_NAME;
}

function hasSpreadAttributes(nodeArray: ts.NodeArray<ts.JsxAttributeLike> | undefined): boolean {
    return !!(nodeArray && nodeArray.find(node => tsutils.isJsxSpreadAttribute(node)));
}

function isTrackElementNode(node: ts.Node): boolean {
    return (
        (tsutils.isJsxElement(node) && node.openingElement.tagName.getText() === TRACK_ELEMENT_NAME) ||
        (tsutils.isJsxSelfClosingElement(node) && node.tagName.getText() === TRACK_ELEMENT_NAME)
    );
}

function containsTrackElementWithSpreadAttributes(node: ts.JsxOpeningElement): boolean {
    function cb(childNode: ts.Node): boolean {
        if (isTrackElementNode(childNode)) {
            const attributes = getAllAttributesFromJsxElement(childNode);
            return hasSpreadAttributes(attributes);
        }
        return false;
    }
    return !!ts.forEachChild(node.parent, cb);
}

function validateMediaType(node: ts.JsxOpeningElement, ctx: Lint.WalkContext<void>): void {
    const validateDescription = isVideoElement(node.tagName);
    let foundCaptions = false;
    let foundDescription = false;
    function cb(childNode: ts.Node): void {
        if (isTrackElementNode(childNode)) {
            const attributes = getAllAttributesFromJsxElement(childNode);
            if (attributes) {
                const kindAttribute = <ts.JsxAttribute>(
                    attributes.find(att => tsutils.isJsxAttribute(att) && att.name.getText() === KIND_ATTRIBUTE_NAME)
                );
                if (!foundCaptions) {
                    foundCaptions = !!(kindAttribute && getStringLiteral(kindAttribute) === CAPTIONS_KIND_NAME);
                }
                if (!foundDescription && validateDescription) {
                    foundDescription = !!(kindAttribute && getStringLiteral(kindAttribute) === DESCRIPTION_KIND_NAME);
                }
            }
        }
        return ts.forEachChild(childNode, cb);
    }
    ts.forEachChild(node.parent, cb);

    if (!foundCaptions) {
        ctx.addFailureAtNode(node, NO_CAPTIONS_ERROR_MESSAGE);
    }
    if (!foundDescription && validateDescription) {
        ctx.addFailureAtNode(node, NO_AUDIO_DESCRIPTION_MESSAGE);
    }
}
