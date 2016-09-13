import React = require('react');

const a = <div aria-level='yes' />
const b = <div aria-level='no' />
const c = <div aria-level={ true } />
const d = <div aria-level={ 'false' } />
const e = <div aria-level={ 1.1 } />
const f = <div aria-level='1.1' />
const g = <div aria-level={ '1.1' } />
