import React = require('react');

// when type='email', 'password', 'search', 'tel', 'url',
// '', or type is undefined, the implicit role is textbox
const a = <input type='email' aria-disabled />
const b = <input type='password' aria-disabled />
const c = <input type='search' aria-disabled />
const d = <input type='tel' aria-disabled />
const e = <input type='url' aria-disabled />
const f = <input aria-disabled />