import React = require('react');

export class BaseClass extends React.Component<{}, {}> {
    public notALocalMethod(): void {
    }
}
declare const autobind: MethodDecorator;

export class MyComponent extends BaseClass {

    @autobind
    private listener1(): void {
    }

    @autobind
    private listener2(): void {
    }

    // this listener is a lambda, so it has its 'this' reference bound correctly.
    private listener3: () => void = (): void => {};

    public render() {
        return <div
            onClick={this.listener1}
            onMouseOver={this.listener2}
            onMouseDown={this.listener3}
            onMouseMove={this.notALocalMethod}> // this is not a real method, so it is OK
        </div>;
    }
}
