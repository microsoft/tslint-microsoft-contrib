import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("reactA11yTitlesRule", (): void => {
    const ruleName: string = "react-a11y-titles";

    it("should pass on when title is not empty", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title>some title</title>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should fail on empty title", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title></title>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Title elements must not be empty",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-a11y-titles",
                startPosition: { character: 27, line: 4 }
            }
        ]);
    });

    it("should fail on self-closing title", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Title elements must not be empty",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-a11y-titles",
                startPosition: { character: 27, line: 4 }
            }
        ]);
    });

    it("should fail on longer than 60 charactes title", (): void => {
        const title: string = Array(61).join("a");
        const script: string = `
            import React = require('react');

            const title = <title>test ${title}</title>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Title length must not be longer than 60 characters: test aaaaaaaaaaaaa...",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-a11y-titles",
                startPosition: {
                    character: 27,
                    line: 4
                }
            }
        ]);
    });

    it("should pass on shorter than 60 characters title", (): void => {
        const title: string = Array(5).join("a");
        const script: string = `
            import React = require('react');

            const title = <title>test ${title}</title>;
        `;
        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should fail on single world title", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title>test</title>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Title must contain more than one word: test",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-a11y-titles",
                startPosition: {
                    character: 27,
                    line: 4
                }
            }
        ]);
    });

    it("should fail on single world title in expression", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title>{'test'}</title>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Title must contain more than one word: test",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-a11y-titles",
                startPosition: {
                    character: 27,
                    line: 4
                }
            }
        ]);
    });

    it("should pass on multi world title", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title>test test</title>;
        `;
        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass on multi world title inside expression", (): void => {
        const script: string = `
            import React = require('react');

            const title = <title>{'test test'}</title>;
        `;
        TestHelper.assertViolations(ruleName, script, []);
    });
});
