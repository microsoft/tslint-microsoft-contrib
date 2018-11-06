"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var Utils_1 = require("./utils/Utils");
var getImplicitRole_1 = require("./utils/getImplicitRole");
var JsxAttribute_1 = require("./utils/JsxAttribute");
var TypeGuard_1 = require("./utils/TypeGuard");
exports.OPTION_IGNORE_CASE = 'ignore-case';
exports.OPTION_IGNORE_WHITESPACE = 'ignore-whitespace';
var ROLE_STRING = 'role';
exports.NO_HASH_FAILURE_STRING = 'Do not use # as anchor href.';
exports.MISSING_HREF_FAILURE_STRING = 'Do not leave href undefined or null';
exports.LINK_TEXT_TOO_SHORT_FAILURE_STRING = 'Link text or the alt text of image in link should be at least 4 characters long. ' +
    "If you are not using <a> element as anchor, please specify explicit role, e.g. role='button'";
exports.UNIQUE_ALT_FAILURE_STRING = 'Links with images and text content, the alt attribute should be unique to the text content or empty.';
exports.SAME_HREF_SAME_TEXT_FAILURE_STRING = 'Links with the same HREF should have the same link text.';
exports.DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING = 'Links that point to different HREFs should have different link text.';
exports.ACCESSIBLE_HIDDEN_CONTENT_FAILURE_STRING = 'Link content can not be hidden for screen-readers by using aria-hidden attribute.';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            var rule = new ReactA11yAnchorsRuleWalker(sourceFile, this.getOptions());
            this.applyWithWalker(rule);
            rule.validateAllAnchors();
            return rule.getFailures();
        }
        return [];
    };
    Rule.metadata = {
        ruleName: 'react-a11y-anchors',
        type: 'functionality',
        description: 'For accessibility of your website, anchor elements must have a href different from # and a text longer than 4.',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [exports.OPTION_IGNORE_CASE, exports.OPTION_IGNORE_WHITESPACE]
            },
            minLength: 0,
            maxLength: 2
        },
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        Optional arguments to relax the same HREF same link text rule are provided:\n        * `", "` ignore differences in cases.\n        * `{\"", "\": \"trim\"}` ignore differences only in leading/trailing whitespace.\n        * `{\"", "\": \"all\"}` ignore differences in all whitespace.\n        "], ["\n        Optional arguments to relax the same HREF same link text rule are provided:\n        * \\`", "\\` ignore differences in cases.\n        * \\`{\"", "\": \"trim\"}\\` ignore differences only in leading/trailing whitespace.\n        * \\`{\"", "\": \"all\"}\\` ignore differences in all whitespace.\n        "])), exports.OPTION_IGNORE_CASE, exports.OPTION_IGNORE_WHITESPACE, exports.OPTION_IGNORE_WHITESPACE),
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReactA11yAnchorsRuleWalker = (function (_super) {
    __extends(ReactA11yAnchorsRuleWalker, _super);
    function ReactA11yAnchorsRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.ignoreCase = false;
        _this.ignoreWhitespace = '';
        _this.anchorInfoList = [];
        _this.parseOptions();
        return _this;
    }
    ReactA11yAnchorsRuleWalker.prototype.parseOptions = function () {
        var _this = this;
        this.getOptions().forEach(function (opt) {
            if (typeof opt === 'string' && opt === exports.OPTION_IGNORE_CASE) {
                _this.ignoreCase = true;
            }
            if (TypeGuard_1.isObject(opt)) {
                _this.ignoreWhitespace = opt[exports.OPTION_IGNORE_WHITESPACE];
            }
        });
    };
    ReactA11yAnchorsRuleWalker.prototype.validateAllAnchors = function () {
        var _this = this;
        var sameHrefDifferentTexts = [];
        var differentHrefSameText = [];
        var _loop_1 = function () {
            var current = this_1.anchorInfoList.shift();
            this_1.anchorInfoList.forEach(function (anchorInfo) {
                if (current.href &&
                    current.href === anchorInfo.href &&
                    !_this.compareAnchorsText(current, anchorInfo) &&
                    !Utils_1.Utils.contains(sameHrefDifferentTexts, anchorInfo)) {
                    sameHrefDifferentTexts.push(anchorInfo);
                    _this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.SAME_HREF_SAME_TEXT_FAILURE_STRING + _this.firstPosition(current));
                }
                if (current.href !== anchorInfo.href &&
                    _this.compareAnchorsText(current, anchorInfo) &&
                    !Utils_1.Utils.contains(differentHrefSameText, anchorInfo)) {
                    differentHrefSameText.push(anchorInfo);
                    _this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING + _this.firstPosition(current));
                }
            });
        };
        var this_1 = this;
        while (this.anchorInfoList.length > 0) {
            _loop_1();
        }
    };
    ReactA11yAnchorsRuleWalker.prototype.compareAnchorsText = function (anchor1, anchor2) {
        var text1 = anchor1.text;
        var text2 = anchor2.text;
        var altText1 = anchor1.altText;
        var altText2 = anchor2.altText;
        if (this.ignoreCase) {
            text1 = text1.toLowerCase();
            text2 = text2.toLowerCase();
            altText1 = altText1.toLowerCase();
            altText2 = altText2.toLowerCase();
        }
        if (this.ignoreWhitespace === 'trim') {
            text1 = text1.trim();
            text2 = text2.trim();
            altText1 = altText1.trim();
            altText2 = altText2.trim();
        }
        if (this.ignoreWhitespace === 'all') {
            var regex = /\s/g;
            text1 = text1.replace(regex, '');
            text2 = text2.replace(regex, '');
            altText1 = altText1.replace(regex, '');
            altText2 = altText2.replace(regex, '');
        }
        return text1 === text2 && altText1 === altText2;
    };
    ReactA11yAnchorsRuleWalker.prototype.firstPosition = function (anchorInfo) {
        var startPosition = this.createFailure(anchorInfo.start, anchorInfo.width, '')
            .getStartPosition()
            .getLineAndCharacter();
        var character = startPosition.character + 1;
        var line = startPosition.line + 1;
        return " First link at character: " + character + " line: " + line;
    };
    ReactA11yAnchorsRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.validateAnchor(node, node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    ReactA11yAnchorsRuleWalker.prototype.visitJsxElement = function (node) {
        this.validateAnchor(node, node.openingElement);
        _super.prototype.visitJsxElement.call(this, node);
    };
    ReactA11yAnchorsRuleWalker.prototype.validateAnchor = function (parent, openingElement) {
        if (openingElement.tagName.getText() === 'a') {
            var hrefAttribute = this.getAttribute(openingElement, 'href');
            var anchorInfo = {
                href: hrefAttribute ? JsxAttribute_1.getStringLiteral(hrefAttribute) || '' : '',
                text: this.anchorText(parent),
                altText: this.imageAlt(parent),
                hasAriaHiddenCount: this.jsxElementAriaHidden(parent),
                start: parent.getStart(),
                width: parent.getWidth()
            };
            if (JsxAttribute_1.isEmpty(hrefAttribute)) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.MISSING_HREF_FAILURE_STRING);
            }
            if (anchorInfo.href === '#') {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.NO_HASH_FAILURE_STRING);
            }
            if (anchorInfo.hasAriaHiddenCount > 0) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.ACCESSIBLE_HIDDEN_CONTENT_FAILURE_STRING);
            }
            if (anchorInfo.altText && anchorInfo.altText === anchorInfo.text) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.UNIQUE_ALT_FAILURE_STRING);
            }
            var anchorInfoTextLength = anchorInfo.text ? anchorInfo.text.length : 0;
            var anchorImageAltTextLength = anchorInfo.altText ? anchorInfo.altText.length : 0;
            if (this.anchorRole(openingElement) === 'link' && anchorInfoTextLength < 4 && anchorImageAltTextLength < 4) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, exports.LINK_TEXT_TOO_SHORT_FAILURE_STRING);
            }
            this.anchorInfoList.push(anchorInfo);
        }
    };
    ReactA11yAnchorsRuleWalker.prototype.getAttribute = function (openingElement, attributeName) {
        var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(openingElement);
        return attributes[attributeName];
    };
    ReactA11yAnchorsRuleWalker.prototype.anchorText = function (root, isChild) {
        var _this = this;
        if (isChild === void 0) { isChild = false; }
        var title = '';
        if (root === undefined) {
            return title;
        }
        else if (root.kind === ts.SyntaxKind.JsxElement) {
            var jsxElement = root;
            jsxElement.children.forEach(function (child) {
                title += _this.anchorText(child, true);
            });
        }
        else if (root.kind === ts.SyntaxKind.JsxText) {
            var jsxText = root;
            title += jsxText.getText();
        }
        else if (root.kind === ts.SyntaxKind.StringLiteral) {
            var literal = root;
            title += literal.text;
        }
        else if (root.kind === ts.SyntaxKind.JsxExpression) {
            var expression = root;
            title += this.anchorText(expression.expression);
        }
        else if (isChild && root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            var jsxSelfClosingElement = root;
            if (jsxSelfClosingElement.tagName.getText() !== 'img') {
                title += '<component>';
            }
        }
        else if (root.kind !== ts.SyntaxKind.JsxSelfClosingElement) {
            title += '<unknown>';
        }
        return title;
    };
    ReactA11yAnchorsRuleWalker.prototype.anchorRole = function (root) {
        var attributesInElement = JsxAttribute_1.getJsxAttributesFromJsxElement(root);
        var roleProp = attributesInElement[ROLE_STRING];
        return roleProp ? JsxAttribute_1.getStringLiteral(roleProp) : getImplicitRole_1.getImplicitRole(root);
    };
    ReactA11yAnchorsRuleWalker.prototype.imageAltAttribute = function (openingElement) {
        if (openingElement.tagName.getText() === 'img') {
            var altAttribute = JsxAttribute_1.getStringLiteral(this.getAttribute(openingElement, 'alt'));
            return altAttribute === undefined ? '<unknown>' : altAttribute;
        }
        return '';
    };
    ReactA11yAnchorsRuleWalker.prototype.imageAlt = function (root) {
        var _this = this;
        var altText = '';
        if (root.kind === ts.SyntaxKind.JsxElement) {
            var jsxElement = root;
            altText += this.imageAltAttribute(jsxElement.openingElement);
            jsxElement.children.forEach(function (child) {
                altText += _this.imageAlt(child);
            });
        }
        if (root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            var jsxSelfClosingElement = root;
            altText += this.imageAltAttribute(jsxSelfClosingElement);
        }
        return altText;
    };
    ReactA11yAnchorsRuleWalker.prototype.ariaHiddenAttribute = function (openingElement) {
        return this.getAttribute(openingElement, 'aria-hidden') === undefined;
    };
    ReactA11yAnchorsRuleWalker.prototype.jsxElementAriaHidden = function (root) {
        var _this = this;
        var hasAriaHiddenCount = 0;
        if (root.kind === ts.SyntaxKind.JsxElement) {
            var jsxElement = root;
            hasAriaHiddenCount += this.ariaHiddenAttribute(jsxElement.openingElement) ? 0 : 1;
            jsxElement.children.forEach(function (child) {
                hasAriaHiddenCount += _this.jsxElementAriaHidden(child);
            });
        }
        if (root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            var jsxSelfClosingElement = root;
            hasAriaHiddenCount += this.ariaHiddenAttribute(jsxSelfClosingElement) ? 0 : 1;
        }
        return hasAriaHiddenCount;
    };
    return ReactA11yAnchorsRuleWalker;
}(Lint.RuleWalker));
var templateObject_1;
//# sourceMappingURL=reactA11yAnchorsRule.js.map