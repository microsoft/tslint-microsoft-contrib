import React = require('react');

let validAltValue;
const a = <img role={undefined} alt='validAltValue' />
const b = <img role={undefined} Alt={validAltValue} />
const c = <img role={undefined} ALT={'validAltValue'} />
const d = <img role={undefined} alt={validAltValue + 'validAltValue'} />
