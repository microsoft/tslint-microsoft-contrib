import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("noSingleLineBlockCommentRule", (): void => {
    const ruleName: string = "no-single-line-block-comment";

    it("should pass on multi-line block comment", (): void => {
        const script: string = `
            /**
            * This is a multiline comment.
            */
            const something = 'whatever';
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass on comment within a JSX block", (): void => {
        const script: string = `
            import React = require('react');
            const Thing = () =>
                <div>
                {/* insert some meaningful comment or ignore statement here */}
                {/* insert some other comment with extra space */ }
                Foo
                </div>
        `;
        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when comment is nested inside code", (): void => {
        const script: string = `
            const something = 1 + /* whatever */ 3;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass on tslint suppressions", (): void => {
        const script: string = `
            /* tslint:disable:function-name */
            const something = 'whatever';
            /* tslint:enable:function-name */
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should fail on a trailing single line comment", (): void => {
        const script: string = `
            const something = 'whatever'; /* my comment */
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Replace block comment with a single-line comment",
                name: Utils.absolutePath("file.ts"),
                ruleName: "no-single-line-block-comment",
                startPosition: { character: 43, line: 2 }
            }
        ]);
    });

    it("should fail on a single long block comment", (): void => {
        const script: string = `
            /* Single line */
            const something = 'whatever';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Replace block comment with a single-line comment",
                name: Utils.absolutePath("file.ts"),
                ruleName: "no-single-line-block-comment",
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });
});
