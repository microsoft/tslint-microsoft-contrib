import React = require('react');

// Only one role.
const a = <div role='combobox' aria-controls />
const b = <div role='combobox' aria-expanded />
const c = <div role='combobox' aria-autocomplete />
const d = <div role='combobox' aria-readonly />
const e = <div role='combobox' aria-required />
const f = <div role='combobox' aria-activedescendant />
const g = <div role='combobox' aria-atomic />
const h = <div role='combobox' aria-busy />
const i = <div role='combobox' aria-current />
const j = <div role='combobox' aria-describedby />
const k = <div role='combobox' aria-details />
const l = <div role='combobox' aria-disabled />
const m = <div role='combobox' aria-dropeffect />
const n = <div role='combobox' aria-errormessage />
const o = <div role='combobox' aria-flowto />
const p = <div role='combobox' aria-grabbed />
const r = <div role='combobox' aria-haspopup />
const s = <div role='combobox' aria-hidden />
const t = <div role='combobox' aria-invalid />
const u = <div role='combobox' aria-keyshortcuts />
const v = <div role='combobox' aria-label />
const w = <div role='combobox' aria-labelledby />
const x = <div role='combobox' aria-live />
const y = <div role='combobox' aria-orientation />
const z = <div role='combobox' aria-owns />
const a1 = <div role='combobox' aria-relevant />
const b1 = <div role='combobox' aria-roledescription />

// Multiple roles.
const c1 = <div role='button combobox' aria-expanded aria-pressed aria-readonly />

// when there have explicit role and implicit role, the explicit role will be used first.
const d1 = <input role='combobox' type='reset' aria-readonly />
