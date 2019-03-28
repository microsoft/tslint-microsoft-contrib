import React = require('react');

declare const autobind: MethodDecorator;

export class MyComponent extends React.Component {
    public render() {
        return <div onClick={this.listener1} />;
    }

    @autobind
    private listener1(): void {}
}
