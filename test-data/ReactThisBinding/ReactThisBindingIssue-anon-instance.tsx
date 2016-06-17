import React = require('react');

export class MyComponent extends React.Component<{}, {}> {

    private listener(): void {
    }

    public render() {
        return <div>
                   // all of these examples create instances of anonymous functions on every render() call
                   <span onClick={this.listener.bind(this)} />
                   <span onClick={_.bind(this.listener, this)} />
                   <span onClick={this.listener.bind(this, 'something else')} />

                   // create some self-closing elements as welll
                   <span onClick={() => {}} ></span>
                   <span onClick={function() {}} ></span>
               </div>;
    }
}
