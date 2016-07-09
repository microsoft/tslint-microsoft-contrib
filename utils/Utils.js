"use strict";
var Utils;
(function (Utils) {
    function exists(list, predicate) {
        if (list != null) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (predicate(obj)) {
                    return true;
                }
            }
        }
        return false;
    }
    Utils.exists = exists;
    function reduce(list, predicate, initialValue) {
        var result = initialValue;
        if (list != null) {
            list.forEach(function (element) {
                result = predicate(result, element);
            });
        }
        return result;
    }
    Utils.reduce = reduce;
    function contains(list, element) {
        return exists(list, function (item) {
            return item === element;
        });
    }
    Utils.contains = contains;
    function removeAll(source, elementsToRemove) {
        if (source == null || source.length === 0) {
            return [];
        }
        if (elementsToRemove == null || elementsToRemove.length === 0) {
            return [].concat(source);
        }
        return filter(source, function (sourceElement) {
            return !contains(elementsToRemove, sourceElement);
        });
    }
    Utils.removeAll = removeAll;
    function filter(list, predicate) {
        if (list == null || list.length === 0) {
            return [];
        }
        return reduce(list, function (memo, sourceElement) {
            if (predicate(sourceElement)) {
                memo.push(sourceElement);
            }
            return memo;
        }, []);
    }
    Utils.filter = filter;
    function trimTo(source, maxLength) {
        if (source == null) {
            return '';
        }
        if (source.length <= maxLength) {
            return source;
        }
        return source.substr(0, maxLength - 2) + '...';
    }
    Utils.trimTo = trimTo;
})(Utils = exports.Utils || (exports.Utils = {}));
//# sourceMappingURL=Utils.js.map