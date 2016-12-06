import {TestHelper} from './TestHelper';
import {
    NO_HASH_FAILURE_STRING,
    LINK_TEXT_TOO_SHORT_FAILURE_STRING,
    UNIQUE_ALT_FAILURE_STRING,
    SAME_HREF_SAME_TEXT_FAILURE_STRING,
    DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING
} from '../reactA11yAnchorsRule';

/**
 * Unit tests.
 */
describe('reactA11yAnchorsRule', () : void => {

    const ruleName : string = 'react-a11y-anchors';

    it('should pass on opening anchor when href contains alphanumeric characters', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="someRef">someTitle</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on function call', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href={PrivacyNotification.privacyNoticeLink}>
                            {TEXT(CommonKey.privacy_notice_2())}
                        </a>
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on self closing anchor without link text', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="someRef"/>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": LINK_TEXT_TOO_SHORT_FAILURE_STRING,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 28, "line": 3 }
            }
        ]);
    });

    it('should fail on anchor when href is #', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="#">someTitle</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": NO_HASH_FAILURE_STRING,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 28, "line": 3 }
            }
        ]);
    });

    it('should fail on self closing anchor when href is #', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="#"/>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": NO_HASH_FAILURE_STRING,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 28, "line": 3 }
            },
            {
                "failure": LINK_TEXT_TOO_SHORT_FAILURE_STRING,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 28, "line": 3 }
            }
        ]);
    });

    describe('Link text should be at least 4 characters long', (): void => {
        it('should pass when length of text equals or larger than 4', () => {
            const script: string = `
                import React = require('react');
                const anchor1 = <a href="someRef1">save</a>;
                const anchor2 = <a href="someRef2">Delete</a>;
                const anchor3 = <a href="someRef3"><span>cancel</span></a>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('should pass when role is not link and length of text less than 4', () => {
            // Anchor without 'href' attribute has no corresponding role.
            const script: string = `
                import React = require('react');
                const anchor1 = <a role='button'>add</a>;
                const anchor2 = <a role='button'><span className='iconClass'></span></a>;
                const anchor3 = <a><img src='someURL' alt='someAlt' /></a>;
            `;

            TestHelper.assertNoViolation(ruleName, script);
        });

        it('should fail when length of text less than 4', (): void => {
            const script: string = `
                import React = require('react');
                const anchor1 = <a href="someRef1">ok</a>;
                const anchor2 = <a href="someRef2"><span>Go</span></a>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": LINK_TEXT_TOO_SHORT_FAILURE_STRING,
                    "name": "file.tsx",
                    "ruleName": "react-a11y-anchors",
                    "startPosition": { "character": 33, "line": 3 }
                },
                {
                    "failure": LINK_TEXT_TOO_SHORT_FAILURE_STRING,
                    "name": "file.tsx",
                    "ruleName": "react-a11y-anchors",
                    "startPosition": { "character": 33, "line": 4 }
                }
            ]);
        });
    });

    it('should pass when hrefs and texts both are identical', () : void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a href="someRef">someTitle</a>;
            const anchor2 = <a href="someRef">someTitle</a>;
            const anchor3 = <a href="someRef">someTitle</a>;
            const anchor4 = <a href="someRef">someTitle</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('shoud pass when hrefs undefiend and texts are variant', (): void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a>someTitle1</a>;
            const anchor2 = <a>someTitle2</a>;
            const anchor3 = <a>someTitle3</a>;
            const anchor4 = <a>someTitle4</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when hrefs and texts both are different', () : void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a href="someRef1">someTitle1</a>;
            const anchor2 = <a href="someRef2">someTitle2</a>;
            const anchor3 = <a href="someRef3">someTitle3</a>;
            const anchor4 = <a href="someRef4">someTitle4</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail when identical hrefs have different texts', () : void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a href="someRef">someTitle1</a>;
            const anchor2 = <a href="someRef1">someTitle2</a>;
            const anchor3 = <a href="someRef">someTitle3</a>;  // should fail with line 3
            const anchor4 = <a href="someRef1">someTitle4</a>; // should fail with line 4
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": `${SAME_HREF_SAME_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 29, "line": 5 }
            },
            {
                "failure": `${SAME_HREF_SAME_TEXT_FAILURE_STRING} First link at character: 29 line: 4`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 29, "line": 6 }
            }
        ]);
    });

    it('should fail when identical hrefs have different texts in multiple repeated anchors', () : void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a href="someRef">someTitle1</a>;
            const anchor2 = <a href="someRef">someTitle2</a>; // should fail with line 3
            const anchor3 = <a href="someRef">someTitle3</a>; // should fail with line 3
            const anchor4 = <a href="someRef">someTitle4</a>; // should fail with line 3
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": `${SAME_HREF_SAME_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": {
                    "character": 29,
                    "line": 4
                }
            },
            {
                "failure": `${SAME_HREF_SAME_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": {
                    "character": 29,
                    "line": 5
                }
            },
            {
                "failure": `${SAME_HREF_SAME_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": {
                    "character": 29,
                    "line": 6
                }
            }
        ]);
    });

    it('should fail when different hrefs have same text', () : void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a href="someRef1">someTitle1</a>;
            const anchor2 = <a href="someRef2">someTitle2</a>;
            const anchor3 = <a href="someRef3">someTitle1</a>; // should fail with line 3
            const anchor4 = <a href="someRef4">someTitle2</a>; // should fail with line 4
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": `${DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": {
                    "character": 29,
                    "line": 5
                }
            },
            {
                "failure": `${DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING} First link at character: 29 line: 4`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": {
                    "character": 29,
                    "line": 6
                }
            }
        ]);
    });

    it('should fail when different hrefs have same text in multiple repeated anchors', () : void => {
        const script : string = `
            import React = require('react');
            const anchor1 = <a href="someRef1">someTitle</a>;
            const anchor2 = <a href="someRef2">someTitle</a>; // should fail with line 3
            const anchor3 = <a href="someRef3">someTitle</a>; // should fail with line 3 - not 4
            const anchor4 = <a href="someRef4">someTitle</a>; // should fail with line 3 - not 4 or 5
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": `${DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 29, "line": 4 }
            },
            {
                "failure": `${DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 29, "line": 5 }
            },
            {
                "failure": `${DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING} First link at character: 29 line: 3`,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 29, "line": 6 }
            }
        ]);
    });

    it('should pass on anchor with image content when alt is unique', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="someRef"><img alt="someOtherTitle"/>someTitle</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on anchor with image content when alt is empty', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="someRef"><img alt=""/>someTitle</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on anchor with image content when alt is identical to text', () : void => {
        const script : string = `
            import React = require('react');
            const anchor = <a href="someRef"><img alt="someTitle"/><span>someTitle</span></a>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": UNIQUE_ALT_FAILURE_STRING,
                "name": "file.tsx",
                "ruleName": "react-a11y-anchors",
                "startPosition": { "character": 28, "line": 3 }
            }
        ]);
    });
});
