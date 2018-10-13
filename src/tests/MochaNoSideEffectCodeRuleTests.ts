import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('mochaNoSideEffectCodeRule', () : void => {

    const ruleName : string = 'mocha-no-side-effect-code';

    it('should pass on not a mocha test', () : void => {
        const script : string = `
            var blah = foo;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on most simple case', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                const CONST1 = 'one';
                const CONST2 = 2;
                const CONST3 = true;
                const CONST4 = false;

                before((): void => {
                    const foo = someValue();
                });
                beforeEach((): void => {
                    const foo = someValue();
                });
                beforeAll((): void => {
                    const foo = someValue();
                });
                after((): void => {
                    const foo = someValue();
                });
                afterEach((): void => {
                    const foo = someValue();
                });
                afterAll((): void => {
                    const foo = someValue();
                });
                it((): void => {
                    const foo = someValue();
                });
                describe((): void => {
                    const CONST4 = false;
                    it((): void => {
                        const foo = someValue();
                    });
                });
                context((): void => {
                    const CONST4 = false;
                    specify((): void => {
                        const foo = someValue();
                    });
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on usage of skip/only', () : void => {
        const script : string = `
            describe('someTest', (): void => {

                it.skip((): void => {
                });

                describe.skip((): void => {
                    it.skip((): void => {
                    });
                });

                it.only((): void => {
                });
                describe.only((): void => {
                    it.only((): void => {
                    });
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on function declarations', () : void => {
        const script : string = `
            describe('someTest', (): void => {

                function doSomething() {
                    const x = doSomethingElse();
                }
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on multiline string', () : void => {
        const script : string = `
            describe('someTest', (): void => {

                const CONST1 = \`some
                                multi-line
                                string\`;

            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on simple cast', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                const publisher: DTO.Publisher = <any>{ '@class': 'Publisher' };
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on describe.skip', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                describe.skip('someTest', (): void => {
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on complex cast', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                const publisher: DTO.Publisher = <any>doSomething();
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                "Move to before()/beforeEach(): publisher: DTO.Publisher = <...",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 23, "line": 3 }
            }
        ]);
    });

    it('should fail on function calls', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                expect(convertedTags).to.deep.equal(tags);
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                        "Move to before()/beforeEach(): expect(convertedTags).to.dee...",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should fail on context', () : void => {
        const script : string = `
            context('someTest', (): void => {
                expect(convertedTags).to.deep.equal(tags);
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                "Move to before()/beforeEach(): expect(convertedTags).to.dee...",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should pass on correct scoping', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                const CONST1 = 'one';
                const CONST2 = 2;
                const CONST3 = true;
                const CONST4 = false;

                before((): void => {
                    const foo = someValue();
                });
                beforeEach((): void => {
                    const foo = someValue();
                });
                beforeAll((): void => {
                    const foo = someValue();
                });
                after((): void => {
                    const foo = someValue();
                });
                afterEach((): void => {
                    const foo = someValue();
                });
                afterAll((): void => {
                    const foo = someValue();
                });
                it((): void => {
                    const foo = someValue();
                });
                describe((): void => {
                    const CONST4 = false;
                    it((): void => {
                        const foo = someValue();
                    });
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on variable aliasing', () : void => {
        const script : string = `
            let expect: Chai.ExpectStatic = chai.expect;

            describe('someTest', (): void => {
                let expect2: Chai.ExpectStatic = chai.expect;
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when using methods allowed by the Mocha API', () : void => {
        const script : string = `
            describe('retries', (): void => {
                this.retries(42);

                describe('slow', (): void => {
                    this.slow(2500);

                    describe('timeout', (): void => {
                        this.timeout(5000);
                    });
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on date creation', () : void => {
        const script : string = `
            let date = moment();
            let firstActiveDay: Moment = moment().subtract(2, 'years');
            let date2 = new Date(123123123);
            describe('someTest', (): void => {
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on simple JSON structures', () : void => {
        const script : string = `
            let onDaySelected: (newDate: Moment) => void = (newDate: Moment) => {
                return;
            };
            let inputProps: DatePicker.Props = {
                selectedDate: moment(),
                onDaySelected: onDaySelected,
                componentName: 'test'
            };
            describe('someTest', (): void => {
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on complex JSON structures', () : void => {
        const script : string = `
            let searchItems: DTO.SearchItem[] = [
                {'id': '4', 'name': 'All Search Topics', owner: undefined, ownerName: '', createdDate: undefined},
                {'id': '66', 'name': 'Products', 'parentId': '4', owner: undefined, ownerName: '', createdDate: undefined},
                {'id': '314012', 'name': 'Honey', 'parentId': '66', owner: undefined, ownerName: '', createdDate: undefined},
                {'id': '314072', 'name': 'Bonny', 'parentId': '66', owner: undefined, ownerName: '', createdDate: undefined},
                {'id': '65', 'name': 'Uncategorized', 'parentId': '4', owner: undefined, ownerName: '', createdDate: undefined},
                {'id': '216102', 'name': 'Blub', 'parentId': '65', owner: undefined, ownerName: '', createdDate: undefined},
                {'id': '314022', 'name': 'Bnutsch', 'parentId': '65', owner: undefined, ownerName: '', createdDate: undefined}
            ];
            describe('someTest', (): void => {
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass string concatenation', () : void => {
        const script : string = `
            const SMALL_IMAGE: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+' +
                'AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAE9JREFUCB0BRAC7/wAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAD/H1f/AAAA/wAAAAAAAAAAAAAAAP///Vf/AAAAAAAAAAAAAAAAAAAAAAAAAAAA/GsHxbcKPckAAAAASUVORK5CYII=';

            const HOUR: number = 60 * 60;

            describe('someTest', (): void => { });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass configured factory methods', () : void => {
        const script : string = `
            const x = RestDataFactory.createSocialProfile()

            describe('someTest', (): void => {
                const < = RestDataFactory.createSocialProfileToken()
            });
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { ignore: '^RestDataFactory\\.create.*' }], script, [ ]);
    });

    it('should pass newly declared classes', () : void => {
        const script : string = `
            describe('someTest', (): void => {

                class MockModel extends Backbone.Model {

                    public fetch(options?: Backbone.ModelFetchOptions): JQueryXHR {
                        let request: JQueryXHR = super.fetch(options);
                        return request;
                    }

                    public save(attributes?: any, options?: Backbone.ModelSaveOptions): JQueryXHR {
                        let request: JQueryXHR = super.save(attributes, options);
                        return request;
                    }

                }
            });
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on describe', () : void => {
        const script : string = `
            describe('someTest', (): void => {
                const VIOLATION1 = this.myMethod();
                const VIOLATION2 = new MyClass();

                it((): void => {
                    const foo = someValue(); // OK
                });

                describe('someTest', (): void => {
                    const VIOLATION3 = true ? false : true;
                    const VIOLATION4 = x || 'some value';

                    it((): void => {
                        const foo = someValue(); // OK
                    });
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                        "Move to before()/beforeEach(): VIOLATION1 = this.myMethod()",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 23, "line": 3 }
            },
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                        "Move to before()/beforeEach(): VIOLATION2 = new MyClass()",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                        "Move to before()/beforeEach(): VIOLATION3 = true ? false : ...",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 27, "line": 11 }
            },
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                        "Move to before()/beforeEach(): VIOLATION4 = x || 'some value'",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 27, "line": 12 }
            }
        ]);
    });

    it('should fail on global scope', () : void => {
        const script : string = `

            const VIOLATION1 = new MyClass();

            describe('someTest', (): void => {
                it((): void => {
                });
            });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Mocha test contains dangerous variable initialization. " +
                        "Move to before()/beforeEach(): VIOLATION1 = new MyClass()",
                "name": "file.ts",
                "ruleName": "mocha-no-side-effect-code",
                "startPosition": { "character": 19, "line": 3 }
            }
        ]);
    });

    describe('arrays', (): void => {

        it('should pass on empty and simple arrays', () : void => {
            const script : string = `
            describe('someTest', (): void => {
                const CONST1 = [];
                const CONST2 = [ true, false, 1, 0, 'value', null];
            });
        `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should pass on nested simple arrays', () : void => {
            const script : string = `
            describe('someTest', (): void => {
                const options = [true, [
                    'Mobile IE 10',
                    'IE >= 10',
                    'Chrome > 45',
                    'Firefox',
                    'Mobile Safari < 10'
                ]];
            });
        `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should fail on complex arrays', () : void => {
            const script : string = `
            describe('someTest', (): void => {
                const VIOLATION = [ someCall() ];
            });
        `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "Mocha test contains dangerous variable initialization. " +
                            "Move to before()/beforeEach(): VIOLATION = [ someCall() ]",
                    "name": "file.ts",
                    "ruleName": "mocha-no-side-effect-code",
                    "startPosition": { "character": 23, "line": 3 }
                }
            ]);
        });
    });

    describe('Array.forEach', (): void => {

        it('should pass on Array.forEach with empty arrays', () : void => {
            const script : string = `
                describe('something', (): void => {
                    [].forEach((): void => {
                        it('test', (): void => {
                        });
                    });
                });
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should pass on Array.forEach with simple arrays', () : void => {
            const script : string = `
                describe('something', (): void => {
                    [ true, false, 1, 0, 'value', null].forEach((): void => {
                        it('test', (): void => {
                        });
                    });
                });
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should pass on Array.forEach of simple object arrays', () : void => {
            const script : string = `
                describe('something', (): void => {
                    [
                        { name: 'alpha', value: 1 },
                        { name: 'beta', value: 2 },
                        { name: 'gamma', value: 3 }
                    ].forEach((): void => {
                        it('test', (): void => {
                        });
                    });
                });
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should fail on Array.forEach of complex arrays', () : void => {
            const script : string = `
                describe('something', (): void => {
                    [ someCall() ].forEach((): void => {
                        it('test', (): void => {
                        });
                    });
                });
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "Mocha test contains dangerous variable initialization. " +
                            "Move to before()/beforeEach(): [ someCall() ].forEach((): v...",
                    "name": "file.ts",
                    "ruleName": "mocha-no-side-effect-code",
                    "startPosition": { "character": 21, "line": 3 }
                }
            ]);
        });

        it('should fail on Array.forEach from function call', () : void => {
            const script : string = `
                describe('something', (): void => {
                    someCall().forEach((): void => {
                        it('test', (): void => {
                        });
                    });
                });
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "Mocha test contains dangerous variable initialization. " +
                            "Move to before()/beforeEach(): someCall().forEach((): void ...",
                    "name": "file.ts",
                    "ruleName": "mocha-no-side-effect-code",
                    "startPosition": { "character": 21, "line": 3 }
                }
            ]);
        });

        it('should fail on Array.forEach with side effects in function', () : void => {
            const script : string = `
                describe('something', (): void => {
                    [1, 2, 3].forEach((): void => {
                        const VIOLATION = new MyClass();
                        it('test', (): void => {
                        });
                    });
                });
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "Mocha test contains dangerous variable initialization. " +
                            "Move to before()/beforeEach(): VIOLATION = new MyClass()",
                    "name": "file.ts",
                    "ruleName": "mocha-no-side-effect-code",
                    "startPosition": { "character": 31, "line": 4 }
                }
            ]);
        });

    });

});
