import React = require('react');

export class MyComponent extends React.Component<{}, {}> {

    constructor(props, context) {
        super(props, context);
        this.listener1 = this.listener1.bind(this);
        this.listener2 = this.listener2.bind(this);
    }

    private listener1(): void {
    }

    private listener2(): void {
    }

    public render() {
        return <div
            onClick={this.listener1}>
            onMouseOver={this.listener2}>
        </div>;
    }
}
