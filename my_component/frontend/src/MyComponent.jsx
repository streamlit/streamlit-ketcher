import {Streamlit, StreamlitComponentBase, withStreamlitConnection,} from "streamlit-component-lib";
import React, {createRef} from "react";
import {Editor as KetcherEditor} from 'ketcher-react'
import {StandaloneStructServiceProvider} from 'ketcher-standalone'
import 'ketcher-react/dist/index.css'

const structServiceProvider = new StandaloneStructServiceProvider()

class MyComponent extends StreamlitComponentBase {
    constructor(props) {
        super(props);
        this.state = {ketcher: undefined, molecule: this.props.args["molecule"]};
        this.resizeObserver = null;
        this.resizeElement = createRef();
        Streamlit.setComponentValue(this.state.molecule);
    }

    componentDidMount() {
        this.resizeObserver = new ResizeObserver((entries) => {
            Streamlit.setFrameHeight();
        });

        this.resizeObserver.observe(this.resizeElement.current);
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    render() {
        const molecule = this.state.molecule;

        const editor = <KetcherEditor
            staticResourcesUrl={process.env.PUBLIC_URL}
            structServiceProvider={structServiceProvider}
            errorHandler={console.error.bind(console)}
            onInit={(ketcher) => {
                this.setState({ketcher}, () => {
                    if(molecule) {
                        this.state.ketcher.setMolecule(molecule);
                    }
                });
            }}/>

        let push = <button onClick={() => this.onReset()} disabled={!this.state.ketcher}>Reset</button>;
        let load = <button onClick={() => this.onApply()} disabled={!this.state.ketcher}>Apply</button>;

        return (
            <div ref={this.resizeElement}>
                {editor}
                <div style={{display: "flex", justifyContent: 'space-between'}}>{load}{push}</div>
            </div>
        );
    }

    async onApply() {
        const smile = await this.state.ketcher.getSmiles();
        this.setState({molecule: smile}, () => {
            Streamlit.setComponentValue(this.state.molecule);
        })
    }

    async onReset() {
        await this.state.ketcher.setMolecule(this.state.molecule)
    }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MyComponent);
