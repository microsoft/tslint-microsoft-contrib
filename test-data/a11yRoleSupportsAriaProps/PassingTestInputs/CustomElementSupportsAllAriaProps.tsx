import React = require('react');

const TextField = () => (
    <input />
);

const Error = () => (
    <label />
)

const a = <TextField aria-required={ true } />
const b = <Error aria-errormessage='Not an error' />
