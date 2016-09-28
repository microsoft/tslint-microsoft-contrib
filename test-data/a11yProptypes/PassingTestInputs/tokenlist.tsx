import React = require('react');

const a = <div aria-relevant='additions' />
const b = <div aria-relevant={ 'additions' } />
const c = <div aria-relevant='additions removals' />
const d = <div aria-relevant='additions additions' />
const e = <div aria-relevant='additions removals text' />
const f = <div aria-relevant={ 'additions removals text' } />
const g = <div aria-relevant='additions removals text all' />
const h = <div aria-relevant={ 'additions removals text all' } />
