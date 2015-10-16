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

}
/* tslint:enable:no-increment-decrement */

export = Utils;