import { Utils } from "../utils/Utils";
import { TestHelper } from "./TestHelper";

describe("reactUnusedPropsAndStateRule", (): void => {
    const ruleName: string = "react-unused-props-and-state";

    it("should pass on referenced Props and State", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp1: boolean;
                    myProp2: boolean;
                }
                export interface State {
                    myState1: boolean;
                    myState2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, VideoContainer.State> {

                constructor(props: VideoContainer.Props) {
                    super(props);
                }

                public render(): ReactTypes.ReactElement<any> {
                    console.log(this.props.myProp1);
                    console.log(this.props.myProp2);
                    console.log(this.state.myState1);
                    console.log(this.state.myState2);
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass on referenced Props and State functions", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp: ();
                }
                export interface State {
                    myState: ();
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, VideoContainer.State> {
                public render(): ReactTypes.ReactElement<any> {
                    console.log(this.props.myProp());
                    console.log(this.state.myState());
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props and state escape the class/function", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp: ();
                }
                export interface State {
                    myState: ();
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, VideoContainer.State> {
                public render(): ReactTypes.ReactElement<any> {
                    console.log(this.props); // this.props has escaped the function and might be used elsewhere
                    console.log(this.state);
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props referenced from constructor parameter", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp: ();
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                constructor(props: VideoContainer.Props) {
                    super(props);
                    console.log(props.myProp());
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props referenced from constructor parameter", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp: ();
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                constructor(props: VideoContainer.Props) {
                    super(props);
                    console.log(props.myProp());
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props referenced from lifecycle method ", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    prop1: boolean;
                    prop2: boolean;
                    prop3: boolean;
                    prop4: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                public componentWillReceiveProps(nextProps: P, nextContext: any): void {
                    console.log(nextProps.prop1);
                }
                public shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any): boolean {
                    console.log(nextProps.prop2);
                    return true;
                }
                public componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {
                    console.log(nextProps.prop3);
                }
                public componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {
                    console.log(prevProps.prop4);
                }

                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when state referenced from lifecycle method ", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface State {
                    state1: boolean;
                    state2: boolean;
                    state3: boolean;
                }
            }

            class VideoContainer extends React.Component<{}, VideoContainer.State> {
                public shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any): boolean {
                    console.log(nextState.state1);
                    return true;
                }
                public componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {
                    console.log(nextState.state2);
                }
                public componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {
                    console.log(prevState.state3);
                }

                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when state escapes from shouldComponentUpdate", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface State {
                    state1: boolean;
                    state2: boolean;
                }
            }

            class VideoContainer extends React.Component<{}, VideoContainer.State> {
                public shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any): boolean {
                    console.log(nextState);
                    return true;
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when state escapes from componentWillUpdate", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface State {
                    state1: boolean;
                    state2: boolean;
                }
            }

            class VideoContainer extends React.Component<{}, VideoContainer.State> {
                public componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {
                    console.log(nextState);
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when state escapes from componentDidUpdate", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface State {
                    state1: boolean;
                    state2: boolean;
                }
            }

            class VideoContainer extends React.Component<{}, VideoContainer.State> {
                public componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {
                    console.log(prevState);
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props escapes from componentWillReceiveProps ", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    prop1: boolean;
                    prop2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                public componentWillReceiveProps(nextProps: P, nextContext: any): void {
                    console.log(nextProps);
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props escapes from shouldComponentUpdate ", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    prop1: boolean;
                    prop2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                public shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any): boolean {
                    console.log(nextProps);
                    return true;
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props escapes from componentWillUpdate", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    prop1: boolean;
                    prop2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                public componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {
                    console.log(nextProps);
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass when props escapes from componentDidUpdate ", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    prop1: boolean;
                    prop2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, {}> {
                public componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {
                    console.log(prevProps);
                }
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should pass on referenced Props and State even when interfaces defined at end", (): void => {
        const script: string = `
            module SomeModule {
                export class SomeComponent extends SomeBaseComponent<Props, State> {
                    public render() {
                        console.log(this.props.myProp);
                        console.log(this.state.myState);
                        return null;
                    }
                }

                export interface Props {
                    myProp: string;
                }

                export interface State {
                    myState: string;
                }
            }
            export = SomeModule;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it("should fail on unused Props and State", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp1: boolean;
                    myProp2: boolean;
                }
                export interface State {
                    myState1: boolean;
                    myState2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, VideoContainer.State> {
                constructor(props: VideoContainer.Props) {
                    super(props);
                }

                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Unused React property defined in interface: myProp1",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 6 }
            },
            {
                failure: "Unused React property defined in interface: myProp2",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 7 }
            },
            {
                failure: "Unused React state defined in interface: myState1",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 10 }
            },
            {
                failure: "Unused React state defined in interface: myState2",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 11 }
            }
        ]);
    });

    it("should fail on unused Props and State with custom names", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface IProps {
                    myProp1: boolean;
                    myProp2: boolean;
                }
                export interface IState {
                    myState1: boolean;
                    myState2: boolean;
                }
            }

            class VideoContainer extends React.Component<VideoContainer.IProps, VideoContainer.IState> {
                constructor(props: VideoContainer.IProps) {
                    super(props);
                }

                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        const options = [
            true,
            {
                "props-interface-regex": "Props$",
                "state-interface-regex": "State$"
            }
        ];

        TestHelper.assertViolationsWithOptions(ruleName, options, script, [
            {
                failure: "Unused React property defined in interface: myProp1",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 6 }
            },
            {
                failure: "Unused React property defined in interface: myProp2",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 7 }
            },
            {
                failure: "Unused React state defined in interface: myState1",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 10 }
            },
            {
                failure: "Unused React state defined in interface: myState2",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 11 }
            }
        ]);
    });

    it("should fail on unused Props and State functions", (): void => {
        const script: string = `
            import React = require('react');

            module VideoContainer {
                export interface Props {
                    myProp: ();
                }
                export interface State {
                    myState: ();
                }
            }

            class VideoContainer extends React.Component<VideoContainer.Props, VideoContainer.State> {
                public render(): ReactTypes.ReactElement<any> {
                    return null;
                }
            }
            export = VideoContainer;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Unused React property defined in interface: myProp",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 6 }
            },
            {
                failure: "Unused React state defined in interface: myState",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 9 }
            }
        ]);
    });

    it("should fail when props are referenced in a ternary expression", (): void => {
        const script: string = `
            import React = require('react');

            module AssigneePicker {

                export interface State {
                    myState1: boolean;
                    myState2: boolean;
                }

                export interface Props {
                    myProps1: string;
                    myProps2: string;
                }
            }

            abstract class AssigneePicker<P extends AssigneePicker.Props, S extends AssigneePicker.State> extends BaseReactComponent<P, S> {

                public render(): ReactTypes.ReactElement<ReactTypes.HTMLAttributes> {
                    const foo = this.state.myState1 ? null : null;
                    const bar = this.props.myProps1 ? null : null;
                    return null;
                }
            }

            export = AssigneePicker;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Unused React property defined in interface: myProps2",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 13 }
            },
            {
                failure: "Unused React state defined in interface: myState2",
                name: Utils.absolutePath("file.tsx"),
                ruleName: "react-unused-props-and-state",
                startPosition: { character: 21, line: 8 }
            }
        ]);
    });
});
