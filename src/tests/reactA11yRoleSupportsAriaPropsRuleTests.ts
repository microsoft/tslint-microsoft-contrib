import { TestHelper } from "./TestHelper";
import {
    getFailureStringForNoRole,
    getFailureStringForImplicitRole,
    getFailureStringForNotImplicitRole
} from "../reactA11yRoleSupportsAriaPropsRule";

/**
 * Unit test for a11y-role-supports-aria-props rule.
 */
describe("a11yRoleSupportsAriaPropsRule", () => {
    const ruleName: string = "react-a11y-role-supports-aria-props";

    describe("should pass", () => {
        const fileDirectory: string = "test-data/a11yRoleSupportsAriaProps/PassingTestInputs/";

        it("when the element is react custom element", () => {
            const fileName: string = fileDirectory + "CustomElementSupportsAllAriaProps.tsx";
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it("when empty role supports all aria props in element", () => {
            const fileName: string = `
        import React = require('react');

        // Empty role only supports global attributes.
        const a = <div aria-atomic />
        const b = <div aria-dropeffect />
        const c = <div aria-errormessage />
        const d = <div aria-flowto />
        const e = <div aria-grabbed />
        const f = <div aria-haspopup />
        const g = <div aria-hidden />
        const h = <div aria-invalid />
        const i = <div aria-keyshortcuts />
        const j = <div aria-label />
        const k = <div aria-labelledby />
        const l = <div aria-live />
        const m = <div aria-owns />
        const n = <div aria-relevant />
        const o = <div aria-roledescription />
        const p = <div role aria-busy />
        const q = <div aria-controls />
        const r = <div role='' aria-current />
        const s = <div role={ '' } aria-describedby />
        const t = <a aria-details />
        const u = <input type='week' aria-disabled />      `;
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it("when explicit role supports all aria props in element", () => {
            const fileName: string = fileDirectory + "ExplicitRoleSupportsAllAriaProps.tsx";
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it("when implicit role supports all aria props in element", () => {
            const fileName: string = fileDirectory + "ImplicitRoleSupportsAllAriaProps.tsx";
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it("when role is defined but not retrievable", () => {
            const fileName: string = fileDirectory + "UnretrievableRoleSupportsAllAriaProps.tsx";
            TestHelper.assertNoViolation(ruleName, fileName);
        });
    });

    describe("should fail", () => {
        const fileDirectory: string = "test-data/a11yRoleSupportsAriaProps/FailingTestInputs/";

        it("when element has not supported aria props for empty role", () => {
            const fileName: string = fileDirectory + "ElementHasNotSupportedAriaPropsForEmptyRole.tsx";

            TestHelper.assertViolations(ruleName, fileName, [
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 3 },
                    failure: getFailureStringForNoRole("div", ["aria-checked"])
                },
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 4 },
                    failure: getFailureStringForNoRole("a", ["aria-checked"])
                }
            ]);
        });

        it("when element has not supported aria props for implicit role", () => {
            const fileName: string = fileDirectory + "ElementHasNotSupportedAriaPropsForImplicitRole.tsx";

            TestHelper.assertViolations(ruleName, fileName, [
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 3 },
                    failure: getFailureStringForImplicitRole("a", "link", ["aria-checked"])
                },
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 4 },
                    failure: getFailureStringForImplicitRole("area", "link", ["aria-checked"])
                },
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 5 },
                    failure: getFailureStringForImplicitRole("link", "link", ["aria-checked"])
                }
            ]);
        });

        it("when element has not supported aria props for explicit role", () => {
            const fileName: string = fileDirectory + "ElementHasNotSupportedAriaPropsForExplicitRole.tsx";

            TestHelper.assertViolations(ruleName, fileName, [
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 4 },
                    failure: getFailureStringForNotImplicitRole(["button"], ["aria-checked"])
                },
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 7 },
                    failure: getFailureStringForNotImplicitRole(["button", "img"], ["aria-checked"])
                },
                {
                    name: fileName,
                    ruleName: ruleName,
                    startPosition: { character: 11, line: 10 },
                    failure: getFailureStringForNotImplicitRole(["button"], ["aria-checked"])
                }
            ]);
        });
    });
});
