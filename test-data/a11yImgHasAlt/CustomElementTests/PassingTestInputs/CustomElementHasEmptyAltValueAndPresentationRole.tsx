import React = require('react');

let Picture;

const a = <Picture role='presentation' alt />
const b = <Picture role={'presentation'} alt='' />
const c = <Picture role='button presentation' alt={undefined} />
const d = <img role='presentation' alt={ null } />
const e = <img role={'presentation'} alt={ '' } />
const f = <img role='button presentation' alt />
