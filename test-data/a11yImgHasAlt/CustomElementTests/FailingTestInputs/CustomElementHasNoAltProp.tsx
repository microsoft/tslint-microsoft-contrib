import React = require('react');

let Picture = (props) => <img />;

const a = <Picture />
const b = <Picture role='button img' />
const c = <img notAltProp='propValue' />
const d = <img />
