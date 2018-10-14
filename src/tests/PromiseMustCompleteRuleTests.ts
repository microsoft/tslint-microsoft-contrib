import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('promiseMustCompleteRule', () : void => {
    const ruleName : string = 'promise-must-complete';

    describe('should pass', () : void => {
        it('when promise completes', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        resolve('value');
                    } else {
                        if (somethingElse) {
                            resolve('value');
                        } else {
                            reject();
                        }
                    }
                })`;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('on resolve - lambda', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    resolve('value');
                })`;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('on resolve - function', () : void => {
            const script : string = `
                new Promise<string>(function (resolve, reject) {
                    resolve('value');
                })`;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('on resolve - alternative name', () : void => {
            const script : string = `
                new Promise<string>((someOtherName, reject) => {
                    someOtherName('value');
                })`;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('on reject', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    reject('value);
                })`;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('on reject - function', () : void => {
            const script : string = `
                new Promise<string>(function (resolve, reject) {
                    reject('value);
                })`;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('on reject - alternative name', () : void => {
            const script : string = `
                new Promise<string>((resolve, someOtherName) => {
                    someOtherName('value);
                })`;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('when single branch is completed - with if-statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        resolve('value');
                    }
                })`;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single branch is completed - with if-else-statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        resolve('value');
                    } else {
                        resolve('value');
                    }
                })`;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single branch is completed - with if-else-statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        if (somethingElse) {
                            resolve('value');
                        } else {
                            reject();
                        }
                    } else {
                        if (somethingElse) {
                            resolve('value');
                        } else {
                            reject();
                        }
                    }
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('with nested if-else statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        if (somethingElse) {
                            resolve('value');
                        } else {
                            reject();
                        }
                    } else {
                        if (somethingElse) {
                            somethingElse();
                        } else {
                            reject();
                        }
                        reject(); // branches are not even analyzed when main thread resolves
                    }
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a function', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall(function () {
                        resolve('value');
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a lambda', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall(() => {
                        resolve();
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a lambda - with extra parameter', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall((someParm) => {
                        resolve('value');
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a for loop', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    for(var x = 0; x < something.length; x++) {
                        resolve('value');
                    }
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a for in loop', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    for(var x in something) {
                        resolve('value');
                    }
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a while loop', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    while (something) {
                        resolve();
                    }
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolve reference escaped into a function call', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    doSomething(resolve); // reference escapes and we assume it resolves
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when reject reference escaped into a function call', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    doSomething(reject); // reference escapes and we assume it resolves
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when non-shadowed parameter resolves within a function', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall(function (arg1, reject) {
                        resolve('value');
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when non-shadowed parameter rejects within a function', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall(function (resolve, arg2) {
                        reject();
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when non-shadowed parameter resolves within a lambda', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall((arg1, reject) => {
                        resolve('value');
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when non-shadowed parameter rejects within a lambda', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall((resolve, arg2) => {
                        reject();
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

    });

    describe('should fail', () : void => {
        it('when empty lambda', () : void => {
            const script : string = `
                new Promise<string>(() => {
                })`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when empty function', () : void => {
            const script : string = `
                new Promise<string>(function {
                })`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when has no complete', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                })`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when single branch is missing complete - with if-statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        someOtherFunction();
                    }
                })`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when single branch is missing complete - with if-else-statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        resolve('value');
                    } else {
                        someOtherFunction()
                    }
                })`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('with nested if-else statement', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    if (something) {
                        if (somethingElse) {
                            resolve('value');
                        } else {
                            reject();
                        }
                    } else {
                        if (somethingElse) {
                            somethingElse();
                        } else {
                            reject();
                        }
                    }
                })`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when shadowed parameter resolved within a function', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall(function (resolve) {  // this parameter actually shadows the one in the enclosing scope
                        resolve();
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when shadowed parameter rejects within a function', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall(function (reject) {  // this parameter actually shadows the one in the enclosing scope
                        reject();
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when shadowed parameter resolved within a lambda', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall((arg1, resolve) => { // this parameter actually shadows the one in the enclosing scope
                        resolve('value');
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when shadowed parameter rejects within a lambda', () : void => {
            const script : string = `
                new Promise<string>((resolve, reject) => {
                    someCall((reject) => {  // this parameter actually shadows the one in the enclosing scope
                        reject();
                    });
                })`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A Promise was found that appears to not have resolve or reject invoked on all code paths",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "promise-must-complete",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });
    });
});
