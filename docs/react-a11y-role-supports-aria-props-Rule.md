# react-a11y-role-supports-aria-props

Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role`.
Many aria attributes (states and properties) can only be used on elements with particular roles. Some elements have implicit roles, such as `<a href='hrefValue' />`, which will be resolved to `role='link'`. A reference for the implicit roles can be found at [Default Implicit ARIA Semantics](https://www.w3.org/TR/html-aria/#sec-strong-native-semantics).

## References

-   [AX_ARIA_10](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_10)
-   [Supported States & Properties](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)

## Rule options

This rule takes no arguments.

## Examples

### Bad

```tsx
// The explicit checkbox role does not support the aria-checked attribute.
<div role='button' aria-checked='true' />

// The implicit link role does not support the aria-checked attribute.
<a href='hrefValue' aria-checked='true' aria-hidden />
```

### Good

```tsx
// The explicit checkbox role does support the aria-checked attribute.
<div role='checkbox' aria-checked='true' />

// The implicit link role does support the aria-label and aria-hidden attributes.
<a href='hrefValue' aria-label='labelID' aria-hidden />
```

## Note

When an element has explicit and implicit roles at the same time, the explicit role will be used first.
For example:

### Bad

```tsx
// The <input> element explicit role is button, it does not support aria-checked attribute.
<input role="button" type="checkbox" aria-checked="true" />
```

### Good

```tsx
// The <input> element explicit role is checkbox, it supports aria-checked attribute.
<input role="checkbox" type="button" aria-checked="true" />
```
