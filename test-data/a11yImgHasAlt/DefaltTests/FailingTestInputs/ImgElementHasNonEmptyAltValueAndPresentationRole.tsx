import React = require('react');

let altValue;

const a = <img alt='altValue' role='presentation' />
const b = <img Alt='altValue' role='presentation button' />
const c = <img ALT={ altValue } role={ 'presentation' } />
const d = <img alt={'altValue'} role='Presentation' />


const e = <img src="w3html.gif" alt="W3Schools.com" ismap />
const f = <img src="w3html.gif" alt="W3Schools.com" ismap={true} ></img>
const g = <img src="w3html.gif" alt="W3Schools.com" ismap={"true"} ></img>