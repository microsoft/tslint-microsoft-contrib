import React = require('react');

const role = 'some role';

// Only one role.
const a = <div role={ role } aria-controls />
const b = <div role={ role } aria-expanded />
const c = <div role={ role } aria-autocomplete />
const d = <div role={ role } aria-readonly />
const e = <div role={ role } aria-required />
const f = <div role={ role } aria-activedescendant />
const g = <div role={ role } aria-atomic />
const h = <div role={ role } aria-busy />
const i = <div role={ role } aria-current />
const j = <div role={ role } aria-describedby />
const k = <div role={ role } aria-details />
const l = <div role={ role } aria-disabled />
const m = <div role={ role } aria-dropeffect />
const n = <div role={ role } aria-errormessage />
const o = <div role={ role } aria-flowto />
const p = <div role={ role } aria-grabbed />
const r = <div role={ role } aria-haspopup />
const s = <div role={ role } aria-hidden />
const t = <div role={ role } aria-invalid />
const u = <div role={ role } aria-keyshortcuts />
const v = <div role={ role } aria-label />
const w = <div role={ role } aria-labelledby />
const x = <div role={ role } aria-live />
const y = <div role={ role } aria-orientation />
const z = <div role={ role } aria-owns />
const a1 = <div role={ role } aria-relevant />
const b1 = <div role={ role } aria-roledescription />

// Multiple roles.
const c1 = <div role={ role } aria-expanded aria-pressed aria-readonly />

// when there have explicit role and implicit role, the explicit role will be used first.
const d1 = <input role={ role } type='reset' aria-readonly />
