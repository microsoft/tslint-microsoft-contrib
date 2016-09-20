# react-a11y-img-has-alt

Enforce that an `img` element contains the `alt` attribute. For decorative images, using empty alt attribute and role="presentation". All images must have `alt` text to convey their purpose and meaning to **screen reader users**.
Besides, the `alt` attribute specifies an alternate text for an image, if the image cannot be displayed.

## References

- [presentation (role)](https://www.w3.org/TR/wai-aria-1.1/#presentation)

## Rule options

This rule takes one optional argument of an array of strings.
These strings determine which JSX tags should be checked for the `alt` attribute.
The `img` tag will be checked no matter the passed strings.
This is a good use case when you have a wrapper component that simply renders an `img` element (like in React):

```tsx
// Image.tsx
class Image extends React.Component<IImageProps, {}> {
  public render(): JSX.Element {
    return (
      <img alt={ this.props.alt } src={ this.props.src } />
    );
  }
}

// Usage.tsx
public render(): JSX.Element {
  return (
    <Image { ...this.props } alt='Logo' src='logo.jpg' />
  );
}

```
To make this plugin check your `Image` element, specify the following configuration in your `tslint.json` file:

```json
{
  "rules": {
    "a11y-img-has-alt": [true, ["Image"]]
  }
}
```

## Examples

### Bad

```tsx
// Without alt attribute.
<img src='srcUrl' />

// Empty alt attribute without presentation role.
<img alt />
<img alt='' />
<img alt={} />
<img alt={ '' } />
```

### Good

```tsx
// Empty alt attribute with role='presentation'.
<img alt='' role='presentation' />

// <img> element has non-empty alt attribute.
<img alt='altText' />
<img alt={ 'altText' } />
<img alt={ altText } />

// <img> element has spread attributes which might contain alt attribute.
<img { this.props } />
```
