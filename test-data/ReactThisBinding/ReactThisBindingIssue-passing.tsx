import React = require('react');

export class BaseClass extends React.Component<{}, {}> {
    public notALocalMethod(): void {
    }
}

export class MyComponent extends BaseClass {

    constructor(props, context) {
        super(props, context);
        this.listener1 = this.listener1.bind(this); // this listener is bound, so it can be used as a JSX property
        this.listener2 = this.listener2.bind(this); // this listener is bound, so it can be used as a JSX property

        // this is not a bind to the same function (1 vs 2), so it is OK
        this.listener1 = this.listener2.bind(this);
    }

    private listener1(): void {
    }

    private listener2(): void {
    }

    // this listener is a lambda, so it has its 'this' reference bound correctly.
    private listener3: () => void = (): void => {};

    public render() {
        return <div
            onClick={this.listener1}>
            onMouseOver={this.listener2}>
            onMouseDown={this.listener3}>
            onMouseMove={this.notALocalMethod}> // this is not a real method, so it is OK
        </div>;
    }
}
