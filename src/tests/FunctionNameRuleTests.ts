import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

describe('functionNameRule', () : void => {

    const ruleName : string = 'function-name';

    it('should pass on correctly named functions', () : void => {
        const script : string = `
            function foo() {}
            class MyClass {
                foo() {}
                foo1() {}
                myFoo() {}
                myFoo1() {}

                private bar() {}
                private bar1() {}
                private myBar() {}
                private myBar1() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on functions as symbol properties', (): void => {
        const script : string = `
            class MyClass {
                static [Symbol.staticDefault](): any {}
                public static [Symbol.staticPublic](): any {}
                protected static [Symbol.staticProtected](): any {}
                private static [Symbol.staticPrivate](): any {}

                static [Symbol.methodDefault](): any {}
                public static [Symbol.methodPublic](): any {}
                protected static [Symbol.methodProtected](): any {}
                private static [Symbol.methodPrivate](): any {}
            }

            const objLiteral = {
                [Symbol.toStringTag](): string => "hello world"
            }
        `;
        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on correctly public static methods', () : void => {
        const script : string = `
            class MyClass {
                static FOO() {}
                static FOO_BAR() {}
                static FOO_2() {}
                static FO__O() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on correctly private static methods', () : void => {
        const script : string = `
            class MyClass {
                private static bar() {}
                private static bar1() {}
                private static myBar() {}
                private static myBar1() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on correctly protected static methods', () : void => {
        const script : string = `
            class MyClass {
                protected static bar() {}
                protected static bar1() {}
                protected static myBar() {}
                protected static myBar1() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on correctly private static methods as static with option', () : void => {
        const script : string = `
            class MyClass {
                private static BAR() {}
                private static BAR_1() {}
                private static MY_BAR() {}
                private static MY_BAR_1() {}
            }
        `;

        TestHelper.assertNoViolationWithOptions(ruleName, ['true', 'validate-private-statics-as-static'], script);
    });

    it('should pass on correctly protected static methods as static with option', () : void => {
        const script : string = `
            class MyClass {
                protected static BAR() {}
                protected static BAR_1() {}
                protected static MY_BAR() {}
                protected static MY_BAR_1() {}
            }
        `;

        TestHelper.assertNoViolationWithOptions(ruleName, ['true', 'validate-private-statics-as-static'], script);
    });

    it('should pass on correctly private static methods as private with option', () : void => {
        const script : string = `
            class MyClass {
                private static bar() {}
                private static bar1() {}
                private static myBar() {}
                private static myBar1() {}
            }
        `;

        TestHelper.assertNoViolationWithOptions(ruleName, ['true', 'validate-private-statics-as-private'], script);
    });

    it('should pass on correctly protected static methods as private with option', () : void => {
        const script : string = `
            class MyClass {
                protected static bar() {}
                protected static bar1() {}
                protected static myBar() {}
                protected static myBar1() {}
            }
        `;

        TestHelper.assertNoViolationWithOptions(ruleName, ['true', 'validate-private-statics-as-private'], script);
    });

    it('should pass on correctly private or protected static methods as either with option', () : void => {
        const script : string = `
            class MyClass {
                private static bar() {}
                private static bar1() {}
                private static BAR() {}
                private static BAR_1() {}
                protected static myBar() {}
                protected static myBar1() {}
                protected static MY_BAR() {}
                protected static MY_BAR_1() {}
            }
        `;

        TestHelper.assertNoViolationWithOptions(ruleName, ['true', 'validate-private-statics-as-either'], script);
    });

    it('should fail on incorrect public methods', () : void => {
        const script : string = `
            class MyClass {
                Foo() {}
                _foo() {}
                FOO() {}
                _FOO() {}
                _foo() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Method name does not match /^[a-z][\\w\\d]+$/: Foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 17, line: 3 }
            },
            {
                failure: 'Method name does not match /^[a-z][\\w\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 17, line: 4 }
            },
            {
                failure: 'Method name does not match /^[a-z][\\w\\d]+$/: FOO',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 17, line: 5 }
            },
            {
                failure: 'Method name does not match /^[a-z][\\w\\d]+$/: _FOO',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 17, line: 6 }
            },
            {
                failure: 'Method name does not match /^[a-z][\\w\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 17, line: 7 }
            }
        ]);
    });

    it('should fail on incorrect private methods', () : void => {
        const script : string = `
            class MyClass {
                private Foo() {}
                private _foo() {}
                private FOO() {}
                private _FOO() {}
                private _foo() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Private method name does not match /^[a-z][\\w\\d]+$/: Foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 25, line: 3 }
            },
            {
                failure: 'Private method name does not match /^[a-z][\\w\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 25, line: 4 }
            },
            {
                failure: 'Private method name does not match /^[a-z][\\w\\d]+$/: FOO',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 25, line: 5 }
            },
            {
                failure: 'Private method name does not match /^[a-z][\\w\\d]+$/: _FOO',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 25, line: 6 }
            },
            {
                failure: 'Private method name does not match /^[a-z][\\w\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 25, line: 7 }
            }
        ]);
    });

    it('should fail on incorrect protected methods', () : void => {
        const script : string = `
            class MyClass {
                protected Foo() {}
                protected _foo() {}
                protected FOO() {}
                protected _FOO() {}
                protected _foo() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Protected method name does not match /^[a-z][\\w\\d]+$/: Foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 27, line: 3 }
            },
            {
                failure: 'Protected method name does not match /^[a-z][\\w\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 27, line: 4 }
            },
            {
                failure: 'Protected method name does not match /^[a-z][\\w\\d]+$/: FOO',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 27, line: 5 }
            },
            {
                failure: 'Protected method name does not match /^[a-z][\\w\\d]+$/: _FOO',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 27, line: 6 }
            },
            {
                failure: 'Protected method name does not match /^[a-z][\\w\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 27, line: 7 }
            }
        ]);
    });

    it('should fail on incorrect static methods', () : void => {
        const script : string = `
            class MyClass {
                static Foo() {}
                static _foo() {}
                static _foo2() {}
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Static method name does not match /^[A-Z_\\d]+$/: Foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 24, line: 3 }
            },
            {
                failure: 'Static method name does not match /^[A-Z_\\d]+$/: _foo',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 24, line: 4 }
            },
            {
                failure: 'Static method name does not match /^[A-Z_\\d]+$/: _foo2',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'function-name',
                startPosition: { character: 24, line: 5 }
            }
        ]);
    });

    describe('reading options', (): void => {

        let options: any[];

        beforeEach((): void => {
            options = [ true,
                {
                    'method-regex': '^myMethod$',
                    'private-method-regex': '^myPrivateMethod$',
                    'static-method-regex': '^myStaticMethod$',
                    'function-regex': '^myFunction$'
                }
            ];
        });

        it('should allow passing names', (): void => {
            const script : string = `
            function myFunction() {}
            class MyClass {
                myMethod() {}
                private myPrivateMethod() {}
                static myStaticMethod() {}
            }`;

            TestHelper.assertViolationsWithOptions(ruleName, options, script, [ ]);
        });

        it('should ban non-passing names', (): void => {
            const script : string = `
            function notMyFunction() {}
            class MyClass {
                notMyMethod() {}
                private notMyPrivateMethod() {}
                static notMyStaticMethod() {}
            }`;

            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    failure: 'Function name does not match /^myFunction$/: notMyFunction',
                    name: Utils.absolutePath('file.ts'),
                    ruleName: 'function-name',
                    startPosition: { character: 22, line: 2 }
                },
                {
                    failure: 'Method name does not match /^myMethod$/: notMyMethod',
                    name: Utils.absolutePath('file.ts'),
                    ruleName: 'function-name',
                    startPosition: { character: 17, line: 4 }
                },
                {
                    failure: 'Private method name does not match /^myPrivateMethod$/: notMyPrivateMethod',
                    name: Utils.absolutePath('file.ts'),
                    ruleName: 'function-name',
                    startPosition: { character: 25, line: 5 }
                },
                {
                    failure: 'Static method name does not match /^myStaticMethod$/: notMyStaticMethod',
                    name: Utils.absolutePath('file.ts'),
                    ruleName: 'function-name',
                    startPosition: { character: 24, line: 6 }
                }
            ]);
        });
    });
});
