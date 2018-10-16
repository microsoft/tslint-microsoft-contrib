import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noDeleteExpressionRule', (): void => {
    const RULE_NAME: string = 'no-delete-expression';

    it('should not produce violations', (): void => {
        const script: string = `
            var x = {
                myProperty: 'sometext'
            };
            delete x.myProperty;
            delete x[myProperty]

            delete this.router.routes[routeName];

            delete this.router.routes.moreRoutes[routeName];`;
        TestHelper.assertViolations(RULE_NAME, script, []);
    });

    it('should not fail when using subelement notation', (): void => {
        const script: string = `
            delete rights[name];
        `;
        TestHelper.assertViolations(RULE_NAME, script, []);
    });

    it('should produce violations ', (): void => {
        const inputFile: string = `
            var something: int = 22;

            if (something) {
                var variableForDeletion = 10;
                delete variableForDeletion;
            } `;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Variables should not be deleted: variableForDeletion",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-delete-expression",
                "startPosition": {
                    "line": 6,
                    "character": 24
                }
            }
        ]);
    });

});
