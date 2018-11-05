/* tslint:disable:max-line-length */
/* tslint:disable:max-func-body-length */

import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('underscoreConsistentInvocationRule', (): void => {
    const ruleName: string = 'underscore-consistent-invocation';

    it('should pass on wrapping functions in a new instance when style is instance', (): void => {
        const script: string = `
            _(list).each(() => { return undefined; });
            _(list).forEach(() => { return undefined; });
            _(list).map(() => { return undefined; });
            _(list).collect(() => { return undefined; });
            _(list).reduce(() => { return undefined; });
            _(list).inject(() => { return undefined; });
            _(list).foldl(() => { return undefined; });
            _(list).reduceRight(() => { return undefined; });
            _(list).foldr(() => { return undefined; });
            _(list).find(() => { return undefined; });
            _(list).detect(() => { return undefined; });
            _(list).filter(() => { return undefined; });
            _(list).select(() => { return undefined; });
            _(list).where(() => { return undefined; });
            _(list).findWhere(() => { return undefined; });
            _(list).reject(() => { return undefined; });
            _(list).every(() => { return undefined; });
            _(list).all(() => { return undefined; });
            _(list).some(() => { return undefined; });
            _(list).any(() => { return undefined; });
            _(list).contains(() => { return undefined; });
            _(list).include(() => { return undefined; });
            _(list).invoke(() => { return undefined; });
            _(list).pluck(() => { return undefined; });
            _(list).max(() => { return undefined; });
            _(list).min(() => { return undefined; });
            _(list).sortBy(() => { return undefined; });
            _(list).groupBy(() => { return undefined; });
            _(list).indexBy(() => { return undefined; });
            _(list).countBy(() => { return undefined; });
            _(list).shuffle(() => { return undefined; });
            _(list).sample(() => { return undefined; });
            _(list).toArray(() => { return undefined; });
            _(list).size(() => { return undefined; });
            _(list).partition(() => { return undefined; });
            _(list).first(() => { return undefined; });
            _(list).head(() => { return undefined; });
            _(list).take(() => { return undefined; });
            _(list).initial(() => { return undefined; });
            _(list).last(() => { return undefined; });
            _(list).rest(() => { return undefined; });
            _(list).tail(() => { return undefined; });
            _(list).drop(() => { return undefined; });
            _(list).compact(() => { return undefined; });
            _(list).flatten(() => { return undefined; });
            _(list).without(() => { return undefined; });
            _(list).union(() => { return undefined; });
            _(list).intersection(() => { return undefined; });
            _(list).difference(() => { return undefined; });
            _(list).uniq(() => { return undefined; });
            _(list).unique(() => { return undefined; });
            _(list).object(() => { return undefined; });
            _(list).zip(() => { return undefined; });
            _(list).unzip(() => { return undefined; });
            _(list).indexOf(() => { return undefined; });
            _(list).findIndex(() => { return undefined; });
            _(list).lastIndexOf(() => { return undefined; });
            _(list).findLastIndex(() => { return undefined; });
            _(list).sortedIndex(() => { return undefined; });
            _(list).range(() => { return undefined; });
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on invoking the underscore methods statically when style is static', (): void => {
        const script: string = `
            _.each(list, () => { return undefined; });
            _.forEach(list, () => { return undefined; });
            _.map(list, () => { return undefined; });
            _.collect(list, () => { return undefined; });
            _.reduce(list, () => { return undefined; });
            _.inject(list, () => { return undefined; });
            _.foldl(list, () => { return undefined; });
            _.reduceRight(list, () => { return undefined; });
            _.foldr(list, () => { return undefined; });
            _.find(list, () => { return undefined; });
            _.detect(list, () => { return undefined; });
            _.filter(list, () => { return undefined; });
            _.select(list, () => { return undefined; });
            _.where(list, () => { return undefined; });
            _.findWhere(list, () => { return undefined; });
            _.reject(list, () => { return undefined; });
            _.every(list, () => { return undefined; });
            _.all(list, () => { return undefined; });
            _.some(list, () => { return undefined; });
            _.any(list, () => { return undefined; });
            _.contains(list, () => { return undefined; });
            _.include(list, () => { return undefined; });
            _.invoke(list, () => { return undefined; });
            _.pluck(list, () => { return undefined; });
            _.max(list, () => { return undefined; });
            _.min(list, () => { return undefined; });
            _.sortBy(list, () => { return undefined; });
            _.groupBy(list, () => { return undefined; });
            _.indexBy(list, () => { return undefined; });
            _.countBy(list, () => { return undefined; });
            _.shuffle(list, () => { return undefined; });
            _.sample(list, () => { return undefined; });
            _.toArray(list, () => { return undefined; });
            _.size(list, () => { return undefined; });
            _.partition(list, () => { return undefined; });
            _.first(list, () => { return undefined; });
            _.head(list, () => { return undefined; });
            _.take(list, () => { return undefined; });
            _.initial(list, () => { return undefined; });
            _.last(list, () => { return undefined; });
            _.rest(list, () => { return undefined; });
            _.tail(list, () => { return undefined; });
            _.drop(list, () => { return undefined; });
            _.compact(list, () => { return undefined; });
            _.flatten(list, () => { return undefined; });
            _.without(list, () => { return undefined; });
            _.union(list, () => { return undefined; });
            _.intersection(list, () => { return undefined; });
            _.difference(list, () => { return undefined; });
            _.uniq(list, () => { return undefined; });
            _.unique(list, () => { return undefined; });
            _.object(list, () => { return undefined; });
            _.zip(list, () => { return undefined; });
            _.unzip(list, () => { return undefined; });
            _.indexOf(list, () => { return undefined; });
            _.findIndex(list, () => { return undefined; });
            _.lastIndexOf(list, () => { return undefined; });
            _.findLastIndex(list, () => { return undefined; });
            _.sortedIndex(list, () => { return undefined; });
            _.range(list, () => { return undefined; });
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { style: 'static' }], script, []);
    });

    it('should fail on invoking the underscore methods statically when style is instance', (): void => {
        const script: string = `
            _.each(list, () => { return undefined; });
            _.forEach(list, () => { return undefined; });
            _.map(list, () => { return undefined; });
            _.collect(list, () => { return undefined; });
            _.reduce(list, () => { return undefined; });
            _.inject(list, () => { return undefined; });
            _.foldl(list, () => { return undefined; });
            _.reduceRight(list, () => { return undefined; });
            _.foldr(list, () => { return undefined; });
            _.find(list, () => { return undefined; });
            _.detect(list, () => { return undefined; });
            _.filter(list, () => { return undefined; });
            _.select(list, () => { return undefined; });
            _.where(list, () => { return undefined; });
            _.findWhere(list, () => { return undefined; });
            _.reject(list, () => { return undefined; });
            _.every(list, () => { return undefined; });
            _.all(list, () => { return undefined; });
            _.some(list, () => { return undefined; });
            _.any(list, () => { return undefined; });
            _.contains(list, () => { return undefined; });
            _.include(list, () => { return undefined; });
            _.invoke(list, () => { return undefined; });
            _.pluck(list, () => { return undefined; });
            _.max(list, () => { return undefined; });
            _.min(list, () => { return undefined; });
            _.sortBy(list, () => { return undefined; });
            _.groupBy(list, () => { return undefined; });
            _.indexBy(list, () => { return undefined; });
            _.countBy(list, () => { return undefined; });
            _.shuffle(list, () => { return undefined; });
            _.sample(list, () => { return undefined; });
            _.toArray(list, () => { return undefined; });
            _.size(list, () => { return undefined; });
            _.partition(list, () => { return undefined; });
            _.first(list, () => { return undefined; });
            _.head(list, () => { return undefined; });
            _.take(list, () => { return undefined; });
            _.initial(list, () => { return undefined; });
            _.last(list, () => { return undefined; });
            _.rest(list, () => { return undefined; });
            _.tail(list, () => { return undefined; });
            _.drop(list, () => { return undefined; });
            _.compact(list, () => { return undefined; });
            _.flatten(list, () => { return undefined; });
            _.without(list, () => { return undefined; });
            _.union(list, () => { return undefined; });
            _.intersection(list, () => { return undefined; });
            _.difference(list, () => { return undefined; });
            _.uniq(list, () => { return undefined; });
            _.unique(list, () => { return undefined; });
            _.object(list, () => { return undefined; });
            _.zip(list, () => { return undefined; });
            _.unzip(list, () => { return undefined; });
            _.indexOf(list, () => { return undefined; });
            _.findIndex(list, () => { return undefined; });
            _.lastIndexOf(list, () => { return undefined; });
            _.findLastIndex(list, () => { return undefined; });
            _.sortedIndex(list, () => { return undefined; });
            _.range(list, () => { return undefined; });
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.each',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.forEach',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.map',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 4 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.collect',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 5 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.reduce',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 6 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.inject',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 7 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.foldl',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 8 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.reduceRight',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 9 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.foldr',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 10 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.find',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 11 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.detect',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 12 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.filter',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 13 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.select',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 14 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.where',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 15 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.findWhere',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 16 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.reject',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 17 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.every',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 18 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.all',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 19 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.some',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 20 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.any',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 21 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.contains',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 22 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.include',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 23 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.invoke',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 24 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.pluck',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 25 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.max',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 26 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.min',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 27 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.sortBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 28 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.groupBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 29 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.indexBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 30 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.countBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 31 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.shuffle',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 32 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.sample',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 33 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.toArray',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 34 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.size',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 35 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.partition',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 36 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.first',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 37 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.head',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 38 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.take',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 39 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.initial',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 40 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.last',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 41 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.rest',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 42 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.tail',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 43 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.drop',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 44 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.compact',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 45 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.flatten',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 46 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.without',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 47 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.union',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 48 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.intersection',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 49 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.difference',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 50 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.uniq',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 51 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.unique',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 52 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.object',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 53 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.zip',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 54 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.unzip',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 55 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.indexOf',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 56 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.findIndex',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 57 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.lastIndexOf',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 58 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.findLastIndex',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 59 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.sortedIndex',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 60 }
            },
            {
                failure: 'Static invocation of underscore function found. Prefer instance version instead: _.range',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 61 }
            }
        ]);
    });

    it('should fail on wrapping functions in a new instance when style is static', (): void => {
        const script: string = `
            _(list).each(() => { return undefined; });
            _(list).forEach(() => { return undefined; });
            _(list).map(() => { return undefined; });
            _(list).collect(() => { return undefined; });
            _(list).reduce(() => { return undefined; });
            _(list).inject(() => { return undefined; });
            _(list).foldl(() => { return undefined; });
            _(list).reduceRight(() => { return undefined; });
            _(list).foldr(() => { return undefined; });
            _(list).find(() => { return undefined; });
            _(list).detect(() => { return undefined; });
            _(list).filter(() => { return undefined; });
            _(list).select(() => { return undefined; });
            _(list).where(() => { return undefined; });
            _(list).findWhere(() => { return undefined; });
            _(list).reject(() => { return undefined; });
            _(list).every(() => { return undefined; });
            _(list).all(() => { return undefined; });
            _(list).some(() => { return undefined; });
            _(list).any(() => { return undefined; });
            _(list).contains(() => { return undefined; });
            _(list).include(() => { return undefined; });
            _(list).invoke(() => { return undefined; });
            _(list).pluck(() => { return undefined; });
            _(list).max(() => { return undefined; });
            _(list).min(() => { return undefined; });
            _(list).sortBy(() => { return undefined; });
            _(list).groupBy(() => { return undefined; });
            _(list).indexBy(() => { return undefined; });
            _(list).countBy(() => { return undefined; });
            _(list).shuffle(() => { return undefined; });
            _(list).sample(() => { return undefined; });
            _(list).toArray(() => { return undefined; });
            _(list).size(() => { return undefined; });
            _(list).partition(() => { return undefined; });
            _(list).first(() => { return undefined; });
            _(list).head(() => { return undefined; });
            _(list).take(() => { return undefined; });
            _(list).initial(() => { return undefined; });
            _(list).last(() => { return undefined; });
            _(list).rest(() => { return undefined; });
            _(list).tail(() => { return undefined; });
            _(list).drop(() => { return undefined; });
            _(list).compact(() => { return undefined; });
            _(list).flatten(() => { return undefined; });
            _(list).without(() => { return undefined; });
            _(list).union(() => { return undefined; });
            _(list).intersection(() => { return undefined; });
            _(list).difference(() => { return undefined; });
            _(list).uniq(() => { return undefined; });
            _(list).unique(() => { return undefined; });
            _(list).object(() => { return undefined; });
            _(list).zip(() => { return undefined; });
            _(list).unzip(() => { return undefined; });
            _(list).indexOf(() => { return undefined; });
            _(list).findIndex(() => { return undefined; });
            _(list).lastIndexOf(() => { return undefined; });
            _(list).findLastIndex(() => { return undefined; });
            _(list).sortedIndex(() => { return undefined; });
            _(list).range(() => { return undefined; });
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { style: 'static' }], script, [
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).each',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 2 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).forEach',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 3 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).map',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 4 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).collect',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 5 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).reduce',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 6 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).inject',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 7 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).foldl',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 8 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).reduceRight',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 9 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).foldr',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 10 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).find',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 11 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).detect',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 12 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).filter',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 13 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).select',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 14 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).where',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 15 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).findWhere',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 16 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).reject',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 17 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).every',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 18 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).all',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 19 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).some',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 20 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).any',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 21 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).contains',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 22 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).include',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 23 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).invoke',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 24 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).pluck',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 25 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).max',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 26 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).min',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 27 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).sortBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 28 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).groupBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 29 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).indexBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 30 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).countBy',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 31 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).shuffle',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 32 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).sample',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 33 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).toArray',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 34 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).size',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 35 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).partition',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 36 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).first',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 37 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).head',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 38 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).take',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 39 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).initial',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 40 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).last',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 41 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).rest',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 42 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).tail',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 43 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).drop',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 44 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).compact',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 45 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).flatten',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 46 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).without',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 47 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).union',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 48 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).intersection',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 49 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).difference',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 50 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).uniq',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 51 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).unique',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 52 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).object',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 53 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).zip',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 54 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).unzip',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 55 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).indexOf',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 56 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).findIndex',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 57 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).lastIndexOf',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 58 }
            },
            {
                failure:
                    'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).findLastIndex',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 59 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).sortedIndex',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 60 }
            },
            {
                failure: 'Underscore instance wrapping of variable found. Prefer underscore static functions instead: _(list).range',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'underscore-consistent-invocation',
                startPosition: { character: 13, line: 61 }
            }
        ]);
    });
});
/* tslint:enable:max-line-length */
/* tslint:enable:max-func-body-length */
