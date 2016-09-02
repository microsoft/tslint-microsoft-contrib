import React = require('react');

const a = <div tabIndex='1'/>
const b = <div tabindex={ 1 }></div>
const c = <div tabindex='-2'></div>
const d = <div tabindex='-12345678910'></div>
const e = <div tabindex='+12345678910'></div>