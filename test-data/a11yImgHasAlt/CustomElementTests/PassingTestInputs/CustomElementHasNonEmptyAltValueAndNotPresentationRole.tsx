import React = require('react');

let Picture = (props) => <span />;
let validAltValue;

const a = <Picture alt='validAltValue' role='button' />
const b = <Picture alt={validAltValue} role='link' />
const c = <Picture alt={'validAltValue'} />
const d = <img alt='validAltValue' role='button link' />
const e = <img aLt={validAltValue} />
const f = <img alt={'validAltValue'} />
