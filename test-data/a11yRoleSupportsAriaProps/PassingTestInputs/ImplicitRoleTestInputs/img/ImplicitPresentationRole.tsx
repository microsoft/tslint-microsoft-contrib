import React = require('react');

// when undefined alt or empty alt value, role is presentation
// we also check it in img-has-alt rule.
const a = <img alt='' aria-atomic />
const b = <img alt='' aria-busy />
const c = <img alt='' aria-controls />
const d = <img alt='' aria-describedby />
const e = <img alt='' aria-disabled />
const f = <img alt='' aria-dropeffect />
const g = <img alt='' aria-flowto />
const h = <img alt='' aria-grabbed />
const i = <img alt='' aria-haspopup />
const j = <img alt='' aria-hidden />
const k = <img alt='' aria-invalid />
const l = <img alt='' aria-label />
const m = <img aria-labelledby />
const n = <img alt={''} aria-live />
const o = <img alt aria-owns />
const p = <img alt={undefined} aria-relevant />