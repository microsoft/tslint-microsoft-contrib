import React = require('react');

const a = <div role='slider' aria-valuemax aria-valuemin aria-valuenow />
const b = <div role={ 'slider' } aria-valuemax aria-valuemin aria-valuenow />
const c = <div role='spinbutton' aria-valuemax aria-valuemin aria-valuenow />
const d = <div role={ 'spinbutton' } aria-valuemax aria-valuemin aria-valuenow />
const e = <div role='checkbox' aria-checked='true' />
const f = <div role={ 'combobox' } aria-expanded />
const g = <div role='scrollbar' aria-controls aria-orientation aria-valuemax aria-valuemin aria-valuenow />
const h = <div role='checkbox combobox' aria-checked={'true'} aria-expanded />
const i = <div role={ 'button spinbutton link' } aria-valuemax aria-valuemin aria-valuenow />
