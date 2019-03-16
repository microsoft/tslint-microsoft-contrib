# react-a11y-tabindex-no-positive

Enforce tabindex value is **not greater than zero**.
Avoid positive tabindex attribute values to synchronize the flow of the page with keyboard tab order.

## References

-   [AX_FOCUS_03](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_03)

## Rule options

This rule takes no arguments.

## Examples

### Bad

```tsx
// Never really sure what goes after A.
<span tabindex='1'>A</span>
<span tabindex='5'>B</span>
<span tabindex='3'>C</span>
<span tabindex='2'>D</span>

// An empty tabindex is not allowed.
<span tabindex>E</span>
<span tabindex=''>F</span>
<span tabindex={}>G</span>
<span tabindex={ '' }>H</span>
```

### Good

```tsx
// Using correct tabindex value either 0 or -1.
<span tabindex='0'>A</span>
<span tabindex='-1'>B</span>
<span tabindex={ 0 }>C</span>
<span tabindex={ '0' }>D</span>
```
