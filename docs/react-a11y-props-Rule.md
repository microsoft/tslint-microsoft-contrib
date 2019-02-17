# react-a11y-props

Enforce all `aria-*` attributes are valid. Elements cannot use an invalid `aria-*` attribute.
This rule will fail if it finds an `aria-*` attribute that is not listed in
[WAI-ARIA states and properties](https://www.w3.org/TR/wai-aria-1.1/#state_prop_def).

## Rule options

This rule takes no arguments.

## Examples

### Bad

```tsx
// Using incorrectly spelled aria-labeledby.
<label id='address-label'>Enter your address</label>
<input aria-labeledby='address-label' />
```

### Good

```tsx
<input type='text' />
<label id='address-label'>Enter your address</label>
<input aria-labelledby='address-label' />
```
