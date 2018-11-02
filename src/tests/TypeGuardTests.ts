import * as chai from 'chai';
import * as ts from 'typescript';
import { isNamed, isObject } from '../utils/TypeGuard';

/**
 * Unit tests.
 */
describe('TypeGuards', (): void => {
    describe('isObject', (): void => {
        it('should handle objects.', (): void => {
            chai.expect(isObject({ x: 1 })).to.equal(true, 'object type is not considered object');
        });

        it('should handle non-objects.', (): void => {
            chai.expect(isObject(true)).to.equal(false, 'boolean type is considered object');
        });

        it('should handle undefined.', (): void => {
            chai.expect(isObject(undefined)).to.equal(false, 'undefined is considered object');
        });

        it('should handle arrays.', (): void => {
            chai.expect(isObject([])).to.equal(false, 'array is considered object');
        });
    });

    describe('isNamed', (): void => {
        it('should return true for nodes with a name.', (): void => {
            const node = ts.createClassDeclaration([], [], 'foo', [], [], []);
            chai.expect(isNamed(node)).to.equal(true, 'named node is not considered named');
        });

        it('should return false for nodes with undefined name.', (): void => {
            const node = ts.createFunctionDeclaration(
                [],
                [],
                ts.createToken(ts.SyntaxKind.AsteriskToken),
                undefined,
                [],
                [],
                undefined,
                undefined
            );
            chai.expect(isNamed(node)).to.equal(false, 'unnamed node is considered named');
        });

        it('should return false for nodes without a name.', (): void => {
            const node = ts.createArrayLiteral([], false);
            chai.expect(isNamed(node)).to.equal(false, 'unnamed node is considered named');
        });
    });
});
