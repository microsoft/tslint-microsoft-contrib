import React = require('react');

let validAltValue;
const a = <img role='button' alt='validAltValue' />
const b = <img Alt={validAltValue} />
const c = <img ALT={'validAltValue'} />
const d = <img role={'button img'} alt={validAltValue + 'validAltValue'} />
