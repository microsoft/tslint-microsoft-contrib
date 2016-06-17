import React = require('react');

export class MyComponent extends React.Component<{}, {}> {

    private listenerMethod() {}

    public render() {
        const listener1 = (): void => {};
        const listener2 = function() {};
        const listener3 = _.bind(this.listenerMethod, this);
        const listener4 = this.listenerMethod.bind(this);

        return <div
            onClick={listener1}
            onMouseOver={listener2}
            onMouseDown={listener3}
            onMouseOut={listener4}>
        </div>;
    }
}
