/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />


import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('mochaUnneededDoneRule', () : void => {

    const ruleName : string = 'mocha-unneeded-done';

    it('should pass on standard usage - arrow functions', () : void => {
        const script : string = `
            describe('...', (): void => {
                before((done: MochaDone): void => {
                    something(done);
                });
                after((done: MochaDone): void => {
                    something(done);
                });
                beforeEach((done: MochaDone): void => {
                    something(done);
                });
                afterEach((done: MochaDone): void => {
                    something(done);
                });
                it('...', (done: MochaDone): void => {
                    something(done);
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on standard usage - functions expressions', () : void => {
        const script : string = `
            describe('...', function(): void {
                before(function(done: MochaDone): void {
                    something(done);
                });
                after(function(done: MochaDone): void {
                    something(done);
                });
                beforeEach(function(done: MochaDone): void {
                    something(done);
                });
                afterEach(function(done: MochaDone): void {
                    something(done);
                });
                it('...', function(done: MochaDone): void {
                    something(done);
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on reassignment', () : void => {
        const script : string = `
            describe('something...', (): void => {
                it('...', (done): void => {
                    var x = done;
                    done();
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on unneeded dones in arrow functions', () : void => {
        const script : string = `
            describe('...', (): void => {
                before((done): void => {
                    doSomething();
                    done();
                });
                after((done: MochaDone): void => {
                    done(); // it doesn't matter what order done() comes in.
                    doSomething();
                });
                beforeEach((aliasedDone: MochaDone): void => {
                    doSomething();
                    aliasedDone();
                });
                afterEach((done: MochaDone): void => {
                    doSomething();
                    done();
                });
                it('...', (done: MochaDone): void => {
                    doSomething();
                    done();
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 25, "line": 3 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 24, "line": 7 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: aliasedDone",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 29, "line": 11 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 28, "line": 15 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 28, "line": 19 }
            }
        ]);
    });

    it('should fail on unneeded done - functions expressions', () : void => {
        const script : string = `
            describe('...', function(): void {
                before(function(done): void {
                    something();
                    done()
                });
                after(function(myDone: MochaDone): void {
                    myDone(); // it doesn't matter what order it comes in
                    something();
                });
                beforeEach(function(done: MochaDone): void {
                    something();
                    done()
                });
                afterEach(function(done: MochaDone): void {
                    something();
                    done()
                });
                it('...', function(done: MochaDone): void {
                    something();
                    done()
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 33, "line": 3 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: myDone",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 32, "line": 7 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 37, "line": 11 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 36, "line": 15 }
            },
            {
                "failure": "Unneeded Mocha Done. Parameter can be safely removed: done",
                "name": "file.ts",
                "ruleName": "mocha-unneeded-done",
                "startPosition": { "character": 36, "line": 19 }
            }
        ]);
    });
});

