import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("nonLiteralFsPathRule", (): void => {
    const ruleName: string = "non-literal-fs-path";

    it("should pass on literal path", (): void => {
        const script: string = `
            const fs = require('fs');

            fs.existsSync('file');
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass on non related fs functions", (): void => {
        const script: string = `
            const fs = require('fs');

            fs.fsyncSync(-1);
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should fail on non literal path", (): void => {
        const script: string = `
            const fs = require('fs');
            const path = 'file';

            fs.existsSync(path);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Non-literal (insecure) path passed to fs.existsSync: path",
                name: Utils.absolutePath("file.ts"),
                ruleName: "non-literal-fs-path",
                startPosition: { character: 27, line: 5 }
            }
        ]);
    });
});
