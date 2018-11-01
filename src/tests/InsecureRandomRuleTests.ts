import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";
describe("insecureRandomRule", (): void => {
    const ruleName: string = "insecure-random";

    it("should pass on non related functions", (): void => {
        const script: string = `
            import crypto = require('crypto')
            Math.abs(x)
            crypto.randomBytes(2)
            window.crypto.getRandomValues()
        `;
        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should fail on Math.random", (): void => {
        const script: string = `
            Math.random();
            const x = Math.random;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure:
                    "Math.random produces insecure random numbers. " +
                    "Use crypto.randomBytes() or window.crypto.getRandomValues() instead",
                name: Utils.absolutePath("file.ts"),
                ruleName: "insecure-random",
                startPosition: { character: 13, line: 2 }
            },
            {
                failure:
                    "Math.random produces insecure random numbers. " +
                    "Use crypto.randomBytes() or window.crypto.getRandomValues() instead",
                name: Utils.absolutePath("file.ts"),
                ruleName: "insecure-random",
                startPosition: { character: 23, line: 3 }
            }
        ]);
    });

    it("should fail on pseudoRandomBytes", (): void => {
        const script: string = `
            import crypto = require('crypto')

            crypto.pseudoRandomBytes(0);
            const x = crypto.pseudoRandomBytes;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "crypto.pseudoRandomBytes produces insecure random numbers. Use crypto.randomBytes() instead",
                name: Utils.absolutePath("file.ts"),
                ruleName: "insecure-random",
                startPosition: { character: 13, line: 4 }
            },
            {
                failure: "crypto.pseudoRandomBytes produces insecure random numbers. Use crypto.randomBytes() instead",
                name: Utils.absolutePath("file.ts"),
                ruleName: "insecure-random",
                startPosition: { character: 23, line: 5 }
            }
        ]);
    });
});
