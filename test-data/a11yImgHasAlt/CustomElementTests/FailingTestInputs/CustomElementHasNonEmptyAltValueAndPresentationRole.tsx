import React = require('react');

let Picture = (props) => <span />;
let altValue;

const a = <Picture alt='altValue' role='presentation' />
const b = <Picture alt={ 'altValue' } role={ 'presentation' } />
const c = <Picture alt={ altValue } role='Presentation' />
const d = <img alt='altValue' role='presentation button' />
const e = <img aLt='altValue' role='presentation img' />
const f = <img alt={ altValue } role='presentation' />
