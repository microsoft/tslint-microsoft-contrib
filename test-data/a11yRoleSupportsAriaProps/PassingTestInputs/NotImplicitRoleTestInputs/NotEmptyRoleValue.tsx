import React = require('react');

// only one role.
const a = <div role='button' aria-expanded />
const b = <div role='button' aria-pressed />
const c = <div role='button' aria-atomic />
const d = <div role='button' aria-busy />
const e = <div role='button' aria-controls />
const f = <div role='button' aria-describedby />
const g = <div role='button' aria-disabled />
const h = <div role='button' aria-dropeffect />
const i = <div role='button' aria-flowto />
const j = <div role='button' aria-grabbed />
const k = <div role='button' aria-haspopup />
const l = <div role='button' aria-hidden />
const m = <div role='button' aria-invalid />
const n = <div role='button' aria-label />
const o = <div role='button' aria-labelledby />
const p = <div role='button' aria-live />
const q = <div role='button' aria-owns />
const r = <div role='button' aria-relevant />

// Multiple roles
const a1 = <div role='button checkbox' aria-checked />
const b1 = <div role='button checkbox' aria-expanded />
const c1 = <div role='button checkbox' aria-pressed />
const d1 = <div role='button checkbox' aria-atomic />
const e1 = <div role='button checkbox' aria-busy />
const f1 = <div role='button checkbox' aria-controls />
const g1 = <div role='button checkbox' aria-describedby />
const h1 = <div role='button checkbox' aria-disabled />
const i1 = <div role='button checkbox' aria-dropeffect />
const j1 = <div role='button checkbox' aria-flowto />
const k1 = <div role='button checkbox' aria-grabbed />
const l1 = <div role='button checkbox' aria-haspopup />
const m1 = <div role='button checkbox' aria-hidden />
const n1 = <div role='button checkbox' aria-invalid />
const o1 = <div role={'button checkbox'} aria-label />
const p1 = <div role={'button checkbox'} aria-labelledby />
const q1 = <div role={'button checkbox'} aria-live />
const r1 = <div role={'button checkbox'} aria-owns />
const s1 = <div role={'button checkbox'} aria-relevant />

// when there have role prop and implicit role, it will use role prop value.
const a2 = <input role='button' type='checkbox' aria-expanded />
const b2 = <input role='button' type='checkbox' aria-pressed />
const c2 = <input role='button' type='checkbox' aria-atomic />
const d2 = <input role='button' type='checkbox' aria-busy />
const e2 = <input role='button' type='checkbox' aria-controls />
const f2 = <input role='button' type='checkbox' aria-describedby />
const g2 = <input role='button' type='checkbox' aria-disabled />
const h2 = <input role='button' type='checkbox' aria-dropeffect />
const i2 = <input role='button' type='checkbox' aria-flowto />
const j2 = <input role='button' type='checkbox' aria-grabbed />
const k2 = <input role='button' type='checkbox' aria-haspopup />
const l2 = <input role='button' type='checkbox' aria-hidden />
const m2 = <input role='button' type='checkbox' aria-invalid />
const n2 = <input role='button' type='checkbox' aria-label />
const o2 = <input role='button' type='checkbox' aria-labelledby />
const p2 = <input role='button' type='checkbox' aria-live />
const q2 = <input role='button' type='checkbox' aria-owns />
const r2 = <input role='button' type='checkbox' aria-relevant />
