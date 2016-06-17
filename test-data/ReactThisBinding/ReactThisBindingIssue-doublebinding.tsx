import React = require('react');

export class MyComponent extends React.Component<{}, {}> {

    constructor(props, context) {
        super(props, context);
        this.listener = this.listener.bind(this);
        this.listener = this.listener.bind(this);
    }

    private listener(): void {
    }

    public render() {
        return <div
            onClick={this.listener}>
        </div>;
    }
}
