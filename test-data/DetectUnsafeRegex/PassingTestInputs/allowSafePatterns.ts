export const safeLiteral = /a safe pattern/;
export const safeLiteralWithAFalg = /a safe pattern/i;
export const safeLiteralWithFalgs = /a safe pattern/im;

export const safeNew = new RegExp('a safe pattern');
export const safeNewWithAFalg = new RegExp('a safe pattern', 'i');
export const safeNewWithFalgs = new RegExp('a safe pattern', 'im');

export const safeFunction = RegExp('a safe pattern');
export const safeFunctionWithAFalg = RegExp('a safe pattern', 'i');
export const safeFunctionWithFalgs = RegExp('a safe pattern', 'im');
