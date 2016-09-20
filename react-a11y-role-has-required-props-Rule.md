# react-a11y-role-has-required-aria-props

Elements with aria roles must have all required attributes according to the role.

## References

- [WAI-ARIA roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
- [AX_ARIA_03](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_03)

## Rule options

This rule takes no arguments.

## Examples

### Bad

```tsx
// The <div> element has no required attribute aria-checked for checkbox role.
<div role='checkbox' />
```

### Good

```tsx
// The <div> element has required attribute aria-checked for checkbox role.
<div role='checkbox' aria-checked='false' />
```

## Note

When an element has explicit and implicit roles at the same time, the explicit role will be used first.
For example:

### Bad

```tsx
// <input> element explicit role is checkbox, it requires aria-checked attribute.
<input role='checkbox' type='button' />
```

### Good

```tsx
// <input> element implicit role is checkbox, it has required aria-checked attribute.
<input role='checkbox' aria-checked='true' />
```
