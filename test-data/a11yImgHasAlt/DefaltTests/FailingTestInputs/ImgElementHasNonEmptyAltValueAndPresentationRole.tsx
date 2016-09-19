import React = require('react');

let altValue;

const a = <img alt='altValue' role='presentation' />
const b = <img Alt='altValue' role='presentation button' />
const c = <img ALT={ altValue } role={ 'presentation' } />
const d = <img alt={'altValue'} role='Presentation' />
