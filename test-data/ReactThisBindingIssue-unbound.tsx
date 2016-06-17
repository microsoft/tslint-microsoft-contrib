import React = require('react');

export class MyComponent extends React.Component<{}, {}> {

    private listener(): void {
    }

    public render() {
        // a jsx opening and closing element triggers a violation
        return <div
            onClick={this.listener}>

            // a jsx self-closing element triggers a violation
            <span onClick={this.listener} />
        </div>;
    }
}
