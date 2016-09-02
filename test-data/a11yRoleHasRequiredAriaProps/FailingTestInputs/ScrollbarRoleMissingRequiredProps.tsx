import React = require('react');

const a = <div role='scrollbar' />
const b = <div role={ 'scrollbar' } />
const c = <div role={ 'scrollbar' } aria-controls aria-orientation aria-valuemax />
const d = <div role='scrollbar' aria-controls aria-orientation aria-valuemax aria-valuemin />
const e = <div role='scrollbar' aria-orientation aria-valuemax aria-valuemin aria-valuenow />
