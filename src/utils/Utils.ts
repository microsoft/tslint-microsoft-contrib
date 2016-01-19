import * as ts from 'typescript';
/**
 * Control flow functions.
 */
/* tslint:disable:no-increment-decrement */
module Utils {

    /**
     * Logical 'any' or 'exists' function.
     */
    export function exists<T>(list : T[], predicate: (t: T) => boolean) : boolean {
        if (list != null ) {
            for (var i = 0; i < list.length; i++) {
                var obj : T = list[i];
                if (predicate(obj)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * A reduce function.
     */
    export function reduce<T, R>(list : T[], predicate: (memo: R, element: T) => R, initialValue: R) : R {
        var result = initialValue;
        if (list != null ) {
            list.forEach((element: T): void => {
                result = predicate(result, element);
            });
        }
        return result;
    }

}
/* tslint:enable:no-increment-decrement */

export = Utils;