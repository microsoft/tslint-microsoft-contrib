// when role is empty, don't check aria-* props.
<div />
<div role aria-hidden/>
<div role={} />
<div role='' />
<div role={''} ></div>

// when a, area or link tag has no href prop, role is empty.
<a />
<area />
<link aria-hidden />

// when menu or menuitem tag has no type prop, undefined type or empty type value, role is empty.
<menu />
<menu type />
<menu type={} />
<menu type='' />
<menu type={''} />
<menuitem />
<menuitem type />
<menuitem type={} />
<menuitem type='' />
<menuitem type={''} />
