import React = require('react');

// Explicit role.
const a = <div role='heading' aria-level />
const b = <div role='option' aria-selected />
const c = <div role='slider' aria-valuemax aria-valuemin aria-valuenow />
const d = <div role='treeitem' aria-selected />

// Implcit role.
const e = <h1 />

// Multiple roles.
const f = <div role='scrollbar button' aria-controls aria-orientation aria-valuemax aria-valuemin aria-valuenow />
const g = <div role='switch button' aria-checked />
