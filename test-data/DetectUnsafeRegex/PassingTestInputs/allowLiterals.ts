
export const okLiteral = /ok Regex Literal/i;
export const okNewStringLiteral = new RegExp('ok string literal', 'i');
export const okFuncStringLiteral = RegExp('ok string literal', 'i');
export const okTemplate = new RegExp(`ok template`, `i`);
export const okNewFromLitteral = new RegExp(/ok litteral/);
export const okFunctionFromLitteral = RegExp(/ok litteral/);

const Re = RegExp;
export const okRenamed = new Re('ok Renamed');
