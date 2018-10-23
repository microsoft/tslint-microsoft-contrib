import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('informativeDocsRule', () : void => {
    it('should pass on well-described functions', () : void => {
        const script : string = `
            /**
             * Does X Y Z work.
             */
            function foo() {}

            /**
             * Transforms the processed data.
             */
            function bar() {}

            /**
             * Transforms the processed baz data.
             */
            function bazProcessor() {}
        `;

        TestHelper.assertViolations('informative-docs', script, []);
    });

    it('should pass on a non-commented function', () : void => {
        const script : string = `
            function foo() {}
        `;

        TestHelper.assertViolations('informative-docs', script, []);
    });

    it('should fail on uninformative docs comments of all kinds', () : void => {
        const script : string = `
            /**
             * Foo class
             */
            class FooClass {
                /**
                 * the foo method declaration
                 */
                fooMethodDeclaration() {}

                /**
                 * The foo property declaration.
                 */
                public fooPropertyDeclaration;
            }

            /**
             * the Foo enum.
             */
            enum FooEnum {}

            /**
             * The foo function
             */
            function fooFunction() {}

            const _ = {
                /**
                 * The foo get accessor.
                 */
                get fooGetAccessor() {
                    return 0;
                }
            };

            /**
             * The foo interface.
             */
            interface IFooInterface {}

            /**
             * The foo module.
             */
            module FooModule {}

            /**
             * The foo type.
             */
            type fooType = {};
        `;

        TestHelper.assertViolations('informative-docs', script, [
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 5 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 17, line: 9 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 17, line: 14 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 20 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 25 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 17, line: 31 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 39 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 44 }
            },
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 49 }
            }
        ]);
    });

    it('should fail on uninformative docs comments using alias options', () : void => {
        const script : string = `
            /**
             * The FancyFoo.
             */
            function foo() {}
        `;

        const options = [
            {
                aliases: {
                    foo: ['FancyFoo']
                }
            }
        ];

        TestHelper.assertViolationsWithOptions('informative-docs', options, script, [
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 5 }
            }
        ]);
    });

    it('should fail on uninformative docs comments using useless word options', () : void => {
        const script : string = `
            /**
             * Also foo.
             */
            function foo() {}
        `;

        const options = [
            {
                uselessWords: ['also']
            }
        ];

        TestHelper.assertViolationsWithOptions('informative-docs', options, script, [
            {
                failure: 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'informative-docs',
                startPosition: { character: 13, line: 5 }
            }
        ]);
    });
});