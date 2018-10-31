export const unsafeLitteral1 = /(x+x+)+y/;
export const unsafeLitteral2 = /(a+){10}/;

export const unsafeNew1 = new RegExp('(x+x+)+y');
export const unsafeNew2 = new RegExp('(a+){10}');

export const unsafeFunction1 = RegExp('(x+x+)+y');
export const unsafeFunction2 = RegExp('(a+){10}');

export const unsafeNewFromLiteral = new RegExp(/(x+x+)+y/);
