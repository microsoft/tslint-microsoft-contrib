import React = require('react');

const a = <div aria-valuemax='1.23' />
const b = <div aria-valuemax='+123' />
const c = <div aria-valuemax='-1.23' />
const d = <div aria-valuemax={ '1.23' } />
const e = <div aria-valuemax={ '+1.23' } />
const f = <div aria-valuemax={ '-1.23' } />
const g = <div aria-valuemax={ 123 } />
const h = <div aria-valuemax={ -1.23 } />
