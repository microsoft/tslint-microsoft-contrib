import React = require('react');

// only one role.
const a = <div role='button' aria-checked />

// Multiple roles.
const b = <div role='button img' aria-label aria-checked />

// when there have role prop and implicit role, it will use role prop value.
const c = <input role='button' type='checkbox' aria-checked />
