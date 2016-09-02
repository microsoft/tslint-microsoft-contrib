import React = require('react');

let Picture, validAltValue;

const a = <Picture alt='validAltValue' />
const b = <Picture alt={validAltValue} />
const c = <Picture alt={'validAltValue'} />
const d = <img alt='validAltValue' />
const e = <img aLt={validAltValue} />
const f = <img alt={'validAltValue'} />
