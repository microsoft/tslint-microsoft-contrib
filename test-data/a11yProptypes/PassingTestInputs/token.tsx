import React = require('react');

const a = <div aria-sort='ascending' />
const b = <div aria-sort='ASCENDING' />
const c = <div aria-sort={ 'ascending' } />
const d = <div aria-sort='descending' />
const e = <div aria-sort={ 'descending' } />
const f = <div aria-sort='none' />
const g = <div aria-sort={ 'none' } />
const h = <div aria-sort='other' />
const i = <div aria-sort={ 'other' } />
const j = <div aria-haspopup={ true } />
const k = <div aria-haspopup={ false } />