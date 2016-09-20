# react-a11y-role

Elements with aria roles must use a **valid**, **non-abstract** aria role.
A reference to role defintions can be found at [WAI-ARIA roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).

## References

- [AX_ARIA_01](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_01)
- [DPUB-ARIA roles](https://www.w3.org/TR/dpub-aria-1.0/)

## Rule options

This rule takes no arguments.

## Examples

### Bad

```tsx
<div role='datepicker'></div>           <!-- Bad: 'datepicker' is not an aria role -->
<div role='range'></div>                <!-- Bad: 'range' is an abstract aria role -->

// An empty role is not allowed.
<div role ></div>
<div role=''></div>
<div role={}></div>
<div role={ '' }></div>
```

### Good

```tsx
<div></div>                   <!-- Good: no aria role -->
<div role='button'></div>     <!-- Good: 'button' is a valid aria role -->
<div role={ role }></div>     <!-- Good: role is a variable & cannot be determined until runtime -->
```
