
const pattern = 'bad pattern';
const flags = 'i';

export namespace usingNew {
    export const failWithVariablePattern = new RegExp(pattern);
    export const failWithVariableFlags = new RegExp('literal pattern', flags);
    export const failWithVariablePatternAndFlags = new RegExp(pattern, flags);
}

export namespace usingFunction {
    export const failWithVariablePattern = RegExp(pattern);
    export const failWithVariableFlags = RegExp('literal pattern', flags);
    export const failWithVariablePatternAndFlags = RegExp(pattern, flags);
}
