import React = require('react');

let role, button;
// when role value is not literal string
// lint can not get the value, so not check it
const a = <div role={ role } />
const b = <div role={ button } />
