
let text = '<div>some value</div>div>';

// example of element with start and end tag
<div dangerouslySetInnerHTML={{__html: text}} >
</div>;

function someFunction() {
    // example of self-closing element
    return <div dangerouslySetInnerHTML={{__html: text}} />;
}
