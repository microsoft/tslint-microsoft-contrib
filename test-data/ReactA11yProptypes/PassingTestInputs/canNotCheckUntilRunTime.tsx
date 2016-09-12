import React = require('react');

// We can't get the type of those tests until run time,
// so those tests will pass.
const num: number = 1;
const error: boolean = false;
const a = <div aria-hidden={ !true } />
const b = <div aria-hidden={ `${true}` } />
const c = <div aria-hidden={ 'tr' + 'ue' } />
const d = <div aria-hidden={ +123 } />
const e = <div aria-hidden={ -123 } />
const f = <div aria-hidden={ num } />
const g = <div aria-hidden={ this.props.hidden } />
const h = <div aria-hidden={ <div /> } />
const i = <input aria-hidden={ error ? 'true' : 'false' } />
