/* tslint:disable:max-func-body-length */

import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("noBannedTermsRule", (): void => {
    const RULE_NAME: string = "no-reserved-keywords";

    it("should pass when allowing keys in strings", (): void => {
        const script: string = `
            interface MyInterface {
                'break': String;
            }
        `;
        TestHelper.assertViolationsWithOptions(RULE_NAME, [true, { "allow-quoted-properties": true }], script, []);
    });

    it("should pass when this is used as a parameter name (see #261)", (): void => {
        const script: string = `
            function futureMethod(this: MyInterface) {
              return this.toString();
            }
        `;
        TestHelper.assertNoViolation(RULE_NAME, script);
    });

    it("should not allow the break reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: break",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 5
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: break",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: break",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 12
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: break",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 17
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: break",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-break.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the case reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: case",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: case",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: case",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: case",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: case",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-case.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the catch reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: catch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: catch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: catch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: catch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: catch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-catch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the class reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-class.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: class",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-class.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: class",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-class.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: class",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-class.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            }
        ]);
    });
    it("should not allow the const reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: const",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: const",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: const",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: const",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: const",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-const.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the continue reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: continue",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: continue",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: continue",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: continue",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: continue",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-continue.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the debugger reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: debugger",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: debugger",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: debugger",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: debugger",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: debugger",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-debugger.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the default reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: default",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: default",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: default",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: default",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: default",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-default.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the delete reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: delete",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: delete",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: delete",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: delete",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: delete",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-delete.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the do reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: do",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: do",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: do",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: do",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: do",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-do.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the else reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: else",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: else",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: else",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: else",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: else",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-else.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the enum reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: enum",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: enum",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: enum",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: enum",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: enum",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-enum.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the export reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: export",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: export",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: export",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: export",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: export",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-export.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the extends reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: extends",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: extends",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: extends",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: extends",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: extends",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-extends.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the false reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: false",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: false",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: false",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: false",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: false",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-false.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the finally reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: finally",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: finally",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: finally",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: finally",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: finally",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-finally.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the for reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: for",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: for",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: for",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: for",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: for",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-for.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the function reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: function",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: function",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: function",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: function",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: function",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-function.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the if reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: if",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: if",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: if",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: if",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: if",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-if.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the import in reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: import",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: import",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: import",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: import",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: import",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-import.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the instanceof reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: instanceof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: instanceof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: instanceof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: instanceof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: instanceof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-instanceof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the new reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: new",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: new",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: new",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: new",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: new",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-new.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the null reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: null",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: null",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: null",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: null",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: null",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-null.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the return reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: return",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: return",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: return",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: return",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: return",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-return.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the super reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: super",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: super",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: super",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: super",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: super",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-super.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the switch reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: switch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: switch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: switch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: switch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: switch",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-switch.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the this reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: this",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: this",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: this",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: this",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: this",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-this.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the throw reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: throw",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: throw",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: throw",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: throw",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: throw",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-throw.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the true reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: true",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: true",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: true",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: true",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: true",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-true.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the try reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: try",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: try",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: try",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: try",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: try",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-try.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the typeof reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: typeof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: typeof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: typeof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: typeof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: typeof",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-typeof.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the var reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-var.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            }
        ]);
    });
    it("should not allow the void reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: void",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: void",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: void",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: void",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: void",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-void.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 21
                }
            }
        ]);
    });
    it("should not allow the while reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: while",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: while",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: while",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: while",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: while",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-while.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the with reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: with",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 4
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: with",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: with",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 11
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: with",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 16
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: with",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-with.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 22
                }
            }
        ]);
    });
    it("should not allow the as reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 19,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: as",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-as.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });
    it("should not allow the implements reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 17,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: implements",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-implements.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the interface reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 26,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: interface",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-interface.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the let reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 20,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: let",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-let.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the package reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 24,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: package",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-package.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the private reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 24,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: private",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-private.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the protected reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 26,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: protected",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-protected.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the public reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 23,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: public",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-public.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the static reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 23,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: static",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-static.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the yield reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 36
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 22,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: yield",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-yield.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 43
                }
            }
        ]);
    });
    it("should not allow the any reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 9
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 33
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 20,
                    line: 43
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: any",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-any.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 46
                }
            }
        ]);
    });
    it("should not allow the boolean reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 27
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 33
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 34
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 24,
                    line: 44
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: boolean",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-boolean.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 47
                }
            }
        ]);
    });
    it("should not allow the constructor reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 14
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 19
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 24
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 33
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 28,
                    line: 43
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: constructor",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-constructor.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 46
                }
            }
        ]);
    });
    it("should not allow the declare reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 24,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: declare",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-declare.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });
    it("should not allow the get reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 20,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: get",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-get.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });
    it("should not allow the module reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-module.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 23,
                    line: 49
                }
            }
        ]);
    });
    it("should not allow the require reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-require.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 24,
                    line: 49
                }
            }
        ]);
    });
    it("should not allow the number reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 27
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 33
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 34
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 23,
                    line: 44
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: number",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-number.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 47
                }
            }
        ]);
    });
    it("should not allow the set reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 20,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: set",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-set.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });
    it("should not allow the string reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 27
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 33
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 34
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 23,
                    line: 44
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: string",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-string.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 47
                }
            }
        ]);
    });
    it("should not allow the symbol reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 10
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 26
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 27
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 33
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 34
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 40
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 23,
                    line: 44
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: symbol",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-symbol.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 47
                }
            }
        ]);
    });
    it("should not allow the type reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: type",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-type.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });
    it("should not allow the from reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: from",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-from.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });
    it("should not allow the of reserved word", (): void => {
        const inputFile: string = "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts";
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 9,
                    line: 15
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 20
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 25
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: var",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 30
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 31
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 32
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 37
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 12,
                    line: 38
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 21,
                    line: 39
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 45
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 19,
                    line: 49
                }
            },
            {
                failure: "Forbidden reference to reserved keyword: of",
                name: "test-data/NoReservedKeywords/NoReservedKeywordsTestInput-of.ts",
                ruleName: "no-reserved-keywords",
                startPosition: {
                    character: 5,
                    line: 52
                }
            }
        ]);
    });

    it("should not allow local variable named require", (): void => {
        TestHelper.assertViolations(RULE_NAME, `var require`, [
            {
                failure: "Forbidden reference to reserved keyword: require",
                name: Utils.absolutePath("file.ts"),
                ruleName: "no-reserved-keywords",
                startPosition: { character: 5, line: 1 }
            }
        ]);
    });

    it("should not allow local variable named module", (): void => {
        TestHelper.assertViolations(RULE_NAME, `var module`, [
            {
                failure: "Forbidden reference to reserved keyword: module",
                name: Utils.absolutePath("file.ts"),
                ruleName: "no-reserved-keywords",
                startPosition: { character: 5, line: 1 }
            }
        ]);
    });
});
/* tslint:enable:max-func-body-length */
