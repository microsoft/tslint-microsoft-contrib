import React = require('react');

// when role is empty, don't check aria-* props.
const a = <div />
const b = <div role aria-hidden/>
const c = <div role={undefined} />
const d = <div role='' />
const e = <div role={''} ></div>

// when a, area or link tag has no href prop, role is empty.
const h = <a />
const i = <area />
const j = <link aria-hidden />

// when menu or menuitem tag has no type prop, undefined type or empty type value, role is empty.
const m = <menu />
const n = <menu type />
const o = <menu type={undefined} />
const p = <menu type='' />
const q = <menu type={''} />
const r = <menuitem />
const s = <menuitem type />
const t = <menuitem type={undefined} />
const f = <menuitem type='' />
const g = <menuitem type={''} />
