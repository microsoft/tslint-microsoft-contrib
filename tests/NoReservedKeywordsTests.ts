/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

describe('noBannedTermsRule', () : void => {

    var RULE_NAME : string = 'no-reserved-keywords';

    it('should not allow the break reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-break.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: break",
                "name": "test-data/NoReservedKeywordsTestInput-break.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 5
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-break.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: break",
                "name": "test-data/NoReservedKeywordsTestInput-break.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: break",
                "name": "test-data/NoReservedKeywordsTestInput-break.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 12
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: break",
                "name": "test-data/NoReservedKeywordsTestInput-break.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 17
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: break",
                "name": "test-data/NoReservedKeywordsTestInput-break.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the case reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-case.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [  {
            "failure": "Forbidden reference to reserved keyword: case",
            "name": "test-data/NoReservedKeywordsTestInput-case.ts",
            "ruleName": "no-reserved-keywords",
            "startPosition": {
                "character": 5,
                "line": 4
            }
        },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-case.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: case",
                "name": "test-data/NoReservedKeywordsTestInput-case.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: case",
                "name": "test-data/NoReservedKeywordsTestInput-case.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: case",
                "name": "test-data/NoReservedKeywordsTestInput-case.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: case",
                "name": "test-data/NoReservedKeywordsTestInput-case.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the catch reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-catch.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: catch",
                "name": "test-data/NoReservedKeywordsTestInput-catch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-catch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: catch",
                "name": "test-data/NoReservedKeywordsTestInput-catch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: catch",
                "name": "test-data/NoReservedKeywordsTestInput-catch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: catch",
                "name": "test-data/NoReservedKeywordsTestInput-catch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: catch",
                "name": "test-data/NoReservedKeywordsTestInput-catch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the class reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-class.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: class",
                "name": "test-data/NoReservedKeywordsTestInput-class.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: class",
                "name": "test-data/NoReservedKeywordsTestInput-class.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: class",
                "name": "test-data/NoReservedKeywordsTestInput-class.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            }
        ]);
    });
    it('should not allow the const reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-const.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: const",
                "name": "test-data/NoReservedKeywordsTestInput-const.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-const.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: const",
                "name": "test-data/NoReservedKeywordsTestInput-const.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: const",
                "name": "test-data/NoReservedKeywordsTestInput-const.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: const",
                "name": "test-data/NoReservedKeywordsTestInput-const.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: const",
                "name": "test-data/NoReservedKeywordsTestInput-const.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the continue reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-continue.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: continue",
                "name": "test-data/NoReservedKeywordsTestInput-continue.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-continue.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: continue",
                "name": "test-data/NoReservedKeywordsTestInput-continue.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: continue",
                "name": "test-data/NoReservedKeywordsTestInput-continue.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: continue",
                "name": "test-data/NoReservedKeywordsTestInput-continue.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: continue",
                "name": "test-data/NoReservedKeywordsTestInput-continue.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the debugger reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-debugger.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: debugger",
                "name": "test-data/NoReservedKeywordsTestInput-debugger.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-debugger.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: debugger",
                "name": "test-data/NoReservedKeywordsTestInput-debugger.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: debugger",
                "name": "test-data/NoReservedKeywordsTestInput-debugger.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: debugger",
                "name": "test-data/NoReservedKeywordsTestInput-debugger.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: debugger",
                "name": "test-data/NoReservedKeywordsTestInput-debugger.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the default reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-default.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: default",
                "name": "test-data/NoReservedKeywordsTestInput-default.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-default.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: default",
                "name": "test-data/NoReservedKeywordsTestInput-default.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: default",
                "name": "test-data/NoReservedKeywordsTestInput-default.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: default",
                "name": "test-data/NoReservedKeywordsTestInput-default.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: default",
                "name": "test-data/NoReservedKeywordsTestInput-default.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the delete reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-delete.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: delete",
                "name": "test-data/NoReservedKeywordsTestInput-delete.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-delete.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: delete",
                "name": "test-data/NoReservedKeywordsTestInput-delete.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: delete",
                "name": "test-data/NoReservedKeywordsTestInput-delete.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: delete",
                "name": "test-data/NoReservedKeywordsTestInput-delete.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: delete",
                "name": "test-data/NoReservedKeywordsTestInput-delete.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the do reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-do.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: do",
                "name": "test-data/NoReservedKeywordsTestInput-do.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-do.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: do",
                "name": "test-data/NoReservedKeywordsTestInput-do.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: do",
                "name": "test-data/NoReservedKeywordsTestInput-do.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: do",
                "name": "test-data/NoReservedKeywordsTestInput-do.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: do",
                "name": "test-data/NoReservedKeywordsTestInput-do.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the else reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-else.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: else",
                "name": "test-data/NoReservedKeywordsTestInput-else.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-else.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: else",
                "name": "test-data/NoReservedKeywordsTestInput-else.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: else",
                "name": "test-data/NoReservedKeywordsTestInput-else.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: else",
                "name": "test-data/NoReservedKeywordsTestInput-else.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: else",
                "name": "test-data/NoReservedKeywordsTestInput-else.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the enum reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-enum.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: enum",
                "name": "test-data/NoReservedKeywordsTestInput-enum.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-enum.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: enum",
                "name": "test-data/NoReservedKeywordsTestInput-enum.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: enum",
                "name": "test-data/NoReservedKeywordsTestInput-enum.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: enum",
                "name": "test-data/NoReservedKeywordsTestInput-enum.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: enum",
                "name": "test-data/NoReservedKeywordsTestInput-enum.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the export reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-export.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: export",
                "name": "test-data/NoReservedKeywordsTestInput-export.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-export.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: export",
                "name": "test-data/NoReservedKeywordsTestInput-export.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: export",
                "name": "test-data/NoReservedKeywordsTestInput-export.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: export",
                "name": "test-data/NoReservedKeywordsTestInput-export.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: export",
                "name": "test-data/NoReservedKeywordsTestInput-export.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the extends reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-extends.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: extends",
                "name": "test-data/NoReservedKeywordsTestInput-extends.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-extends.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: extends",
                "name": "test-data/NoReservedKeywordsTestInput-extends.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: extends",
                "name": "test-data/NoReservedKeywordsTestInput-extends.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: extends",
                "name": "test-data/NoReservedKeywordsTestInput-extends.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: extends",
                "name": "test-data/NoReservedKeywordsTestInput-extends.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the false reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-false.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: false",
                "name": "test-data/NoReservedKeywordsTestInput-false.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-false.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: false",
                "name": "test-data/NoReservedKeywordsTestInput-false.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: false",
                "name": "test-data/NoReservedKeywordsTestInput-false.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: false",
                "name": "test-data/NoReservedKeywordsTestInput-false.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: false",
                "name": "test-data/NoReservedKeywordsTestInput-false.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the finally reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-finally.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: finally",
                "name": "test-data/NoReservedKeywordsTestInput-finally.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-finally.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: finally",
                "name": "test-data/NoReservedKeywordsTestInput-finally.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: finally",
                "name": "test-data/NoReservedKeywordsTestInput-finally.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: finally",
                "name": "test-data/NoReservedKeywordsTestInput-finally.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: finally",
                "name": "test-data/NoReservedKeywordsTestInput-finally.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the for reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-for.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: for",
                "name": "test-data/NoReservedKeywordsTestInput-for.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-for.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: for",
                "name": "test-data/NoReservedKeywordsTestInput-for.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: for",
                "name": "test-data/NoReservedKeywordsTestInput-for.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: for",
                "name": "test-data/NoReservedKeywordsTestInput-for.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: for",
                "name": "test-data/NoReservedKeywordsTestInput-for.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the function reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-function.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: function",
                "name": "test-data/NoReservedKeywordsTestInput-function.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-function.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: function",
                "name": "test-data/NoReservedKeywordsTestInput-function.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: function",
                "name": "test-data/NoReservedKeywordsTestInput-function.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: function",
                "name": "test-data/NoReservedKeywordsTestInput-function.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: function",
                "name": "test-data/NoReservedKeywordsTestInput-function.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the if reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-if.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: if",
                "name": "test-data/NoReservedKeywordsTestInput-if.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-if.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: if",
                "name": "test-data/NoReservedKeywordsTestInput-if.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: if",
                "name": "test-data/NoReservedKeywordsTestInput-if.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: if",
                "name": "test-data/NoReservedKeywordsTestInput-if.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: if",
                "name": "test-data/NoReservedKeywordsTestInput-if.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the import in reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-import.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: import",
                "name": "test-data/NoReservedKeywordsTestInput-import.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-import.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: import",
                "name": "test-data/NoReservedKeywordsTestInput-import.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: import",
                "name": "test-data/NoReservedKeywordsTestInput-import.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: import",
                "name": "test-data/NoReservedKeywordsTestInput-import.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: import",
                "name": "test-data/NoReservedKeywordsTestInput-import.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the instanceof reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-instanceof.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: instanceof",
                "name": "test-data/NoReservedKeywordsTestInput-instanceof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-instanceof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: instanceof",
                "name": "test-data/NoReservedKeywordsTestInput-instanceof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: instanceof",
                "name": "test-data/NoReservedKeywordsTestInput-instanceof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: instanceof",
                "name": "test-data/NoReservedKeywordsTestInput-instanceof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: instanceof",
                "name": "test-data/NoReservedKeywordsTestInput-instanceof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the new reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-new.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: new",
                "name": "test-data/NoReservedKeywordsTestInput-new.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-new.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: new",
                "name": "test-data/NoReservedKeywordsTestInput-new.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: new",
                "name": "test-data/NoReservedKeywordsTestInput-new.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: new",
                "name": "test-data/NoReservedKeywordsTestInput-new.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: new",
                "name": "test-data/NoReservedKeywordsTestInput-new.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the null reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-null.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: null",
                "name": "test-data/NoReservedKeywordsTestInput-null.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-null.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: null",
                "name": "test-data/NoReservedKeywordsTestInput-null.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: null",
                "name": "test-data/NoReservedKeywordsTestInput-null.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: null",
                "name": "test-data/NoReservedKeywordsTestInput-null.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: null",
                "name": "test-data/NoReservedKeywordsTestInput-null.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the return reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-return.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: return",
                "name": "test-data/NoReservedKeywordsTestInput-return.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-return.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: return",
                "name": "test-data/NoReservedKeywordsTestInput-return.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: return",
                "name": "test-data/NoReservedKeywordsTestInput-return.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: return",
                "name": "test-data/NoReservedKeywordsTestInput-return.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: return",
                "name": "test-data/NoReservedKeywordsTestInput-return.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the super reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-super.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: super",
                "name": "test-data/NoReservedKeywordsTestInput-super.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-super.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: super",
                "name": "test-data/NoReservedKeywordsTestInput-super.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: super",
                "name": "test-data/NoReservedKeywordsTestInput-super.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: super",
                "name": "test-data/NoReservedKeywordsTestInput-super.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: super",
                "name": "test-data/NoReservedKeywordsTestInput-super.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the switch reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-switch.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: switch",
                "name": "test-data/NoReservedKeywordsTestInput-switch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-switch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: switch",
                "name": "test-data/NoReservedKeywordsTestInput-switch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: switch",
                "name": "test-data/NoReservedKeywordsTestInput-switch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: switch",
                "name": "test-data/NoReservedKeywordsTestInput-switch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: switch",
                "name": "test-data/NoReservedKeywordsTestInput-switch.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the this reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-this.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: this",
                "name": "test-data/NoReservedKeywordsTestInput-this.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-this.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: this",
                "name": "test-data/NoReservedKeywordsTestInput-this.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: this",
                "name": "test-data/NoReservedKeywordsTestInput-this.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: this",
                "name": "test-data/NoReservedKeywordsTestInput-this.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: this",
                "name": "test-data/NoReservedKeywordsTestInput-this.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the throw reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-throw.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: throw",
                "name": "test-data/NoReservedKeywordsTestInput-throw.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-throw.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: throw",
                "name": "test-data/NoReservedKeywordsTestInput-throw.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: throw",
                "name": "test-data/NoReservedKeywordsTestInput-throw.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: throw",
                "name": "test-data/NoReservedKeywordsTestInput-throw.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: throw",
                "name": "test-data/NoReservedKeywordsTestInput-throw.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the true reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-true.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: true",
                "name": "test-data/NoReservedKeywordsTestInput-true.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-true.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: true",
                "name": "test-data/NoReservedKeywordsTestInput-true.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: true",
                "name": "test-data/NoReservedKeywordsTestInput-true.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: true",
                "name": "test-data/NoReservedKeywordsTestInput-true.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: true",
                "name": "test-data/NoReservedKeywordsTestInput-true.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the try reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-try.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: try",
                "name": "test-data/NoReservedKeywordsTestInput-try.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-try.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: try",
                "name": "test-data/NoReservedKeywordsTestInput-try.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: try",
                "name": "test-data/NoReservedKeywordsTestInput-try.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: try",
                "name": "test-data/NoReservedKeywordsTestInput-try.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: try",
                "name": "test-data/NoReservedKeywordsTestInput-try.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the typeof reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-typeof.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: typeof",
                "name": "test-data/NoReservedKeywordsTestInput-typeof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-typeof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: typeof",
                "name": "test-data/NoReservedKeywordsTestInput-typeof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: typeof",
                "name": "test-data/NoReservedKeywordsTestInput-typeof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: typeof",
                "name": "test-data/NoReservedKeywordsTestInput-typeof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: typeof",
                "name": "test-data/NoReservedKeywordsTestInput-typeof.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the var reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-var.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-var.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-var.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-var.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-var.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-var.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-var.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            }
        ]);
    });
    it('should not allow the void reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-void.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: void",
                "name": "test-data/NoReservedKeywordsTestInput-void.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-void.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: void",
                "name": "test-data/NoReservedKeywordsTestInput-void.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: void",
                "name": "test-data/NoReservedKeywordsTestInput-void.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: void",
                "name": "test-data/NoReservedKeywordsTestInput-void.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: void",
                "name": "test-data/NoReservedKeywordsTestInput-void.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 21
                }
            }
        ]);
    });
    it('should not allow the while reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-while.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: while",
                "name": "test-data/NoReservedKeywordsTestInput-while.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-while.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: while",
                "name": "test-data/NoReservedKeywordsTestInput-while.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: while",
                "name": "test-data/NoReservedKeywordsTestInput-while.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: while",
                "name": "test-data/NoReservedKeywordsTestInput-while.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: while",
                "name": "test-data/NoReservedKeywordsTestInput-while.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the with reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-with.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: with",
                "name": "test-data/NoReservedKeywordsTestInput-with.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 4
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-with.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: with",
                "name": "test-data/NoReservedKeywordsTestInput-with.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: with",
                "name": "test-data/NoReservedKeywordsTestInput-with.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 11
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: with",
                "name": "test-data/NoReservedKeywordsTestInput-with.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 16
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: with",
                "name": "test-data/NoReservedKeywordsTestInput-with.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 22
                }
            }
        ]);
    });
    it('should not allow the as reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-as.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 19,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: as",
                "name": "test-data/NoReservedKeywordsTestInput-as.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });
    it('should not allow the implements reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-implements.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 17,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: implements",
                "name": "test-data/NoReservedKeywordsTestInput-implements.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the interface reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-interface.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 26,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: interface",
                "name": "test-data/NoReservedKeywordsTestInput-interface.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the let reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-let.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 20,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: let",
                "name": "test-data/NoReservedKeywordsTestInput-let.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the package reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-package.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 24,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: package",
                "name": "test-data/NoReservedKeywordsTestInput-package.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the private reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-private.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 24,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: private",
                "name": "test-data/NoReservedKeywordsTestInput-private.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the protected reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-protected.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 26,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: protected",
                "name": "test-data/NoReservedKeywordsTestInput-protected.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the public reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-public.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 23,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: public",
                "name": "test-data/NoReservedKeywordsTestInput-public.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the static reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-static.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 23,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: static",
                "name": "test-data/NoReservedKeywordsTestInput-static.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the yield reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-yield.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 36
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 22,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: yield",
                "name": "test-data/NoReservedKeywordsTestInput-yield.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 43
                }
            }
        ]);
    });
    it('should not allow the any reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-any.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 9
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 33
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 20,
                    "line": 43
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: any",
                "name": "test-data/NoReservedKeywordsTestInput-any.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 46
                }
            }
        ]);
    });
    it('should not allow the boolean reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-boolean.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 27
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 33
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 34
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 24,
                    "line": 44
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: boolean",
                "name": "test-data/NoReservedKeywordsTestInput-boolean.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 47
                }
            }
        ]);
    });
    it('should not allow the constructor reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-constructor.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 14
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 19
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 24
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 33
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 28,
                    "line": 43
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: constructor",
                "name": "test-data/NoReservedKeywordsTestInput-constructor.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 46
                }
            }
        ]);
    });
    it('should not allow the declare reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-declare.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 24,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: declare",
                "name": "test-data/NoReservedKeywordsTestInput-declare.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });
    it('should not allow the get reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-get.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 20,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: get",
                "name": "test-data/NoReservedKeywordsTestInput-get.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });
    it('should not allow the module reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-module.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "test-data/NoReservedKeywordsTestInput-module.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 23,
                    "line": 49
                }
            }
        ]);
    });
    it('should not allow the require reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-require.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "test-data/NoReservedKeywordsTestInput-require.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 24,
                    "line": 49
                }
            }
        ]);
    });
    it('should not allow the number reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-number.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 27
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 33
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 34
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 23,
                    "line": 44
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: number",
                "name": "test-data/NoReservedKeywordsTestInput-number.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 47
                }
            }
        ]);
    });
    it('should not allow the set reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-set.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 20,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: set",
                "name": "test-data/NoReservedKeywordsTestInput-set.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });
    it('should not allow the string reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-string.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 27
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 33
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 34
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 23,
                    "line": 44
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: string",
                "name": "test-data/NoReservedKeywordsTestInput-string.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 47
                }
            }
        ]);
    });
    it('should not allow the symbol reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-symbol.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 10
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 26
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 27
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 33
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 34
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 40
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 23,
                    "line": 44
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: symbol",
                "name": "test-data/NoReservedKeywordsTestInput-symbol.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 47
                }
            }
        ]);
    });
    it('should not allow the type reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-type.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: type",
                "name": "test-data/NoReservedKeywordsTestInput-type.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });
    it('should not allow the from reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-from.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: from",
                "name": "test-data/NoReservedKeywordsTestInput-from.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });
    it('should not allow the of reserved word', () : void => {
        var inputFile : string = 'test-data/NoReservedKeywordsTestInput-of.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 9,
                    "line": 15
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 20
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 25
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: var",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 30
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 31
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 32
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 37
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 12,
                    "line": 38
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 21,
                    "line": 39
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 45
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 19,
                    "line": 49
                }
            },
            {
                "failure": "Forbidden reference to reserved keyword: of",
                "name": "test-data/NoReservedKeywordsTestInput-of.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": {
                    "character": 5,
                    "line": 52
                }
            }
        ]);
    });


    it('should not allow local variable named require', () : void => {
        TestHelper.assertViolations(RULE_NAME,
            `var require`,
            [  {
                "failure": "Forbidden reference to reserved keyword: require",
                "name": "file.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": { "character": 5, "line": 1 }
            }]);
    });

    it('should not allow local variable named module', () : void => {
        TestHelper.assertViolations(RULE_NAME,
            `var module`,
            [  {
                "failure": "Forbidden reference to reserved keyword: module",
                "name": "file.ts",
                "ruleName": "no-reserved-keywords",
                "startPosition": { "character": 5, "line": 1 }
            }]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
