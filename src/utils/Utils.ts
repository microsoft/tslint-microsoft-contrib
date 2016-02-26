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
            for (let i = 0; i < list.length; i++) {
                let obj : T = list[i];
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

    /**
     * A contains function.
     */
    export function contains<T>(list: T[], element: T): boolean {
        return exists(list, (item: T): boolean => {
            return item === element;
        });
    }

    /**
     * A removeAll function.
     */
    export function removeAll<T>(source: T[], elementsToRemove: T[]): T[] {
        if (source == null || source.length === 0) {
            return [];
        }
        if (elementsToRemove == null || elementsToRemove.length === 0) {
            return [].concat(source); // be sure to return a copy of the array
        }

        return filter(source, (sourceElement: T): boolean => {
            return !contains(elementsToRemove, sourceElement);
        });
    }

    function filter<T>(list: T[], predicate: (element: T) => boolean): T[] {
        if (list == null || list.length === 0) {
            return [];
        }
        return reduce(list, (memo: T[], sourceElement: T): T[] => {
            if (predicate(sourceElement)) {
                memo.push(sourceElement);
            }
            return memo;
        }, []);
    }
}
/* tslint:enable:no-increment-decrement */

export = Utils;