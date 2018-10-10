import {Utils} from '../utils/Utils';
import { TestHelper } from './TestHelper';

/**
 * Unit tests.
 */
describe('reactTsxCurlySpacing', () => {
    const ruleName: string = 'react-tsx-curly-spacing';

    describe('should pass', () => {

        describe('on single line expressions', () => {
            it('when always set', () => {
                const script: string = `
                    import React = require('react');
                    const a = <Hello name={ firstname } />;
                `;
                TestHelper.assertNoViolation(ruleName, script);
            });

            it('when never set', () => {
                const script: string = `
                    import React = require('react');
                    const a = <Hello name={firstname} />;
                    const b = <div>{/* comment */}</div>;
                `;
                TestHelper.assertViolationsWithOptions(ruleName, [ 'never' ], script, []);
            });
        });

        describe('on multi-line expressions', () => {
            it('when always set', () => {
                const script: string = `
                    import React = require('react');
                    <Hello name={
                      firstname
                    } />
                `;
                TestHelper.assertViolationsWithOptions(ruleName, [ 'always', { allowMultiline: true } ], script, []);
            });

            it('when never set', () => {
                const script: string = `
                    import React = require('react');
                    <Hello name={
                      firstname
                    } />
                `;
                TestHelper.assertViolationsWithOptions(ruleName, [ 'never', { allowMultiline: true } ], script, []);
            });
        });
    });

    describe('should fail', () => {

        describe('on single line expressions', () => {

            it('when always set', () => {
                const script: string = `
                    import React = require('react');

                    const a = <Hello name={firstname} />;
                    const b = <Hello name={ firstname} />;
                    const c = <Hello name={firstname } />;
                `;
                TestHelper.assertViolations(ruleName, script, [
                    {
                        "failure": "A space is required after '{'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 4 }
                    },
                    {
                        "failure": "A space is required before '}'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 4 }
                    },
                    {
                        "failure": "A space is required before '}'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 5 }
                    },
                    {
                        "failure": "A space is required after '{'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 6 }
                    }

                ]);
            });

            it('when never set', () => {
                const script: string = `
                    import React = require('react');
                    const a = <Hello name={ firstname} />;
                    const b = <Hello name={firstname } />;
                    const c = <Hello name={ firstname} />;
                `;
                TestHelper.assertViolationsWithOptions(ruleName, [ 'never' ], script, [
                    {
                        "failure": "There should be no space after '{'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 3 }
                    },
                    {
                        "failure": "There should be no space before '}'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 4 }
                    },
                    {
                        "failure": "There should be no space after '{'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 43, "line": 5 }
                    }
                ]);
            });

        });

        describe('on multi-line expressions', () => {
            it('when always set', () => {
                const script: string = `
                    import React = require('react');
                    <Hello name={
                      firstname
                    } />
                `;
                TestHelper.assertViolationsWithOptions(ruleName, [ 'always', { allowMultiline: false } ], script, [
                    {
                        "failure": "There should be no newline after '{'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 33, "line": 3 }
                    },
                    {
                        "failure": "There should be no newline before '}'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 33, "line": 3 }
                    }
                ]);
            });

            it('when never set', () => {
                const script: string = `
                    import React = require('react');
                    <Hello name={
                      firstname
                    } />
                `;
                TestHelper.assertViolationsWithOptions(ruleName, [ 'never' ], script, [
                    {
                        "failure": "There should be no newline after '{'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 33, "line": 3 }
                    },
                    {
                        "failure": "There should be no newline before '}'",
                        "name": Utils.absolutePath("file.tsx"),
                        "ruleName": "react-tsx-curly-spacing",
                        "startPosition": { "character": 33, "line": 3 }
                    }
                ]);
            });
        });
    });
});
