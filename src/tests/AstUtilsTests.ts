import {AstUtils} from '../utils/AstUtils';
import * as chai from 'chai';

/**
 * Unit tests.
 */
describe('AstUtils', () : void => {
    describe('isJQuery', (): void => {
        it('should match expected strings', (): void => {
            chai.expect(AstUtils.isJQuery('$')).to.equal(true, 'short form');
            chai.expect(AstUtils.isJQuery('jQuery')).to.equal(true, 'typical long form');
            chai.expect(AstUtils.isJQuery('jquery')).to.equal(true, 'another long form');
        });
        it('should not match unexpected strings', (): void => {
            chai.expect(AstUtils.isJQuery('S')).to.equal(false, 'Not jquery');
            chai.expect(AstUtils.isJQuery('query')).to.equal(false, 'Also not jquery');
        });
    });
    describe('isJQueryExpression', (): void => {
        it('should match expected strings', (): void => {
            chai.expect(AstUtils.isJQueryExpression('$')).to.equal(true, 'short form; base base');
            chai.expect(AstUtils.isJQueryExpression('$(html)')).to.equal(true, 'short form; wrapper');
            chai.expect(AstUtils.isJQueryExpression('$(html).children("div")')).to.equal(true, 'short form; wrapper; chained function');

            chai.expect(AstUtils.isJQueryExpression('$someVar.children("div")')).to.equal(true, 'jQuery variable; chained');

            chai.expect(AstUtils.isJQueryExpression('jQuery')).to.equal(true, 'typical long form; base');
            chai.expect(AstUtils.isJQueryExpression('jquery')).to.equal(true, 'typical long form; case insensitive');
            chai.expect(AstUtils.isJQueryExpression('jQuery(html)')).to.equal(true, 'typical long form; wrapper');
            chai.expect(AstUtils.isJQueryExpression('jquery(body)')).to.equal(true, 'typical long form; wrapper; case insensitive');
            chai.expect(AstUtils.isJQueryExpression('jquery("body").find("div")')).to.equal(true,
              'typical long form; wrapper; case insensitive; chained');
        });
        it('should not match unexpected strings', (): void => {
            chai.expect(AstUtils.isJQueryExpression('S')).to.equal(false, 'Not jquery');
        });
    });
});
