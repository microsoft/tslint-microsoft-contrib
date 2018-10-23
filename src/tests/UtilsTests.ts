import {Utils} from '../utils/Utils';
import * as chai from 'chai';

describe('Utils', () : void => {
    describe('contains', (): void => {
        it('should handle empty states', (): void => {
            // tslint:disable-next-line:no-null-keyword
            chai.expect(Utils.contains([], null)).to.equal(false, 'empty array should not contain false');
            chai.expect(Utils.contains([], undefined)).to.equal(false, 'empty array should not contain undefined');
            chai.expect(Utils.contains(undefined, undefined)).to.equal(false, 'undefined should not contain undefined');
        });

        it('should handle numbers', (): void => {
            chai.expect(Utils.contains([1, 2, 3], 1)).to.equal(true, 'array containing 1 should contain 1');
            chai.expect(Utils.contains([1, 2, 3], 0)).to.equal(false, 'array containing 1 should not contain 0');
        });

        it('should handle strings', (): void => {
            chai.expect(Utils.contains(['a', 'b', 'c'], 'a')).to.equal(true, 'array containing \'a\' should contain \'a\'');
            chai.expect(Utils.contains(['a', 'b', 'c'], 'z')).to.equal(false, 'array containing \'a\' should not contain \'z\'');
        });

        it('should handle objects', (): void => {
            const obj1: Object = {};
            const obj2: Object = {};
            const obj3: Object = {};
            const objList = [obj1, obj2];

            chai.expect(Utils.contains(objList, obj1)).to.equal(true, 'object equality test for obj1');
            chai.expect(Utils.contains(objList, obj2)).to.equal(true, 'object equality test for obj2');
            chai.expect(Utils.contains(objList, obj3)).to.equal(false, 'object equality test for obj3');
        });
    });

    describe('removeAll', (): void => {
        it('should handle empty states', (): void => {
            chai.expect(Utils.removeAll([], undefined)).to.deep.equal([], 'remove undefined from empty array');
            chai.expect(Utils.removeAll(undefined, undefined)).to.deep.equal([], 'remove undefined from undefined');
        });

        it('should handle numbers', (): void => {
            chai.expect(Utils.removeAll([1, 2, 3], [1])).to.deep.equal([2, 3], 'removing number');
            chai.expect(Utils.removeAll([1, 2, 3], [1, 2])).to.deep.equal([3], 'removing two numbers');
            chai.expect(Utils.removeAll([1, 2, 3], [1, 2, 3])).to.deep.equal([], 'removing all numbers');
            chai.expect(Utils.removeAll([1, 2, 3], [4, 5, 6])).to.deep.equal([1, 2, 3], 'removing non-contained numbers');
        });

        it('should handle strings', (): void => {
            chai.expect(Utils.removeAll(['a', 'b', 'c'], ['a'])).to.deep.equal(['b', 'c'], 'removing string');
            chai.expect(Utils.removeAll(['a', 'b', 'c'], ['a', 'b'])).to.deep.equal(['c'], 'removing two string');
            chai.expect(Utils.removeAll(['a', 'b', 'c'], ['a', 'b', 'c'])).to.deep.equal([], 'removing all strings');
            chai.expect(Utils.removeAll(['a', 'b', 'c'], ['x', 'y', 'z'])).to.deep.equal(['a', 'b', 'c'], 'removing non-contained strings');
        });

        it('should handle objects', (): void => {
            const obj1: Object = {};
            const obj2: Object = {};
            const obj3: Object = {};
            const objList: Object[] = [obj1, obj2, obj3];

            chai.expect(Utils.removeAll(objList, [obj1])).to.deep.equal([obj2, obj2], 'removing object');
            chai.expect(Utils.removeAll(objList, [obj1, obj3])).to.deep.equal([obj2], 'removing two objects');
            chai.expect(Utils.removeAll(objList, [obj1, obj2, obj3])).to.deep.equal([], 'removing all objects');
            chai.expect(Utils.removeAll(objList, [{}, {}, {}])).to.deep.equal([obj1, obj2, obj3], 'removing non-contained objects');
        });
    });

    it('should trim strings properly', (): void => {
        chai.expect(Utils.trimTo(undefined, 10)).to.equal('');
        chai.expect(Utils.trimTo('', 10)).to.equal('');
        chai.expect(Utils.trimTo('123456789', 10)).to.equal('123456789');
        chai.expect(Utils.trimTo('1234567890', 10)).to.equal('1234567890');
        chai.expect(Utils.trimTo('12345678901', 10)).to.equal('12345678...');
        chai.expect(Utils.trimTo('123456789012', 10)).to.equal('12345678...');
        chai.expect(Utils.trimTo('12345678901234567890', 10)).to.equal('12345678...');
    });
});
