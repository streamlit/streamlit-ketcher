import {Streamlit, withStreamlitConnection,} from "streamlit-component-lib";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Editor as KetcherEditor} from 'ketcher-react'
import {StandaloneStructServiceProvider} from 'ketcher-standalone'
import 'ketcher-react/dist/index.css'
import useResizeObserver from "@react-hook/resize-observer";

const structServiceProvider = new StandaloneStructServiceProvider()


const MyComponent = function (props) {
    const editorRef = useRef(null)
    const [ketcher, setKetcher] = useState(null)
    const [molecule, setMolecule] = useState(props.args["molecule"])

    useEffect(() => Streamlit.setFrameHeight())
    useResizeObserver(editorRef, (entry) => Streamlit.setFrameHeight())

    const {theme} = props
    const style = {}

    if (theme) {
        style['--primary-color'] = theme.primaryColor
        style['--secondary-color'] = "gray"
    }

    const handleReset = useCallback(async () => {
        await ketcher.setMolecule(molecule)
    }, [ketcher, molecule])

    const handleApply = useCallback(async () => {
        const smile = await ketcher.getSmiles();
        setMolecule(smile);
        Streamlit.setComponentValue(smile);
    }, [ketcher])

    const handleKetcherInit = useCallback((ketcher) => {
        setKetcher(ketcher);
        if (molecule) {
            ketcher.setMolecule(molecule)
        }
    }, [molecule])

    return (
        <div ref={editorRef}>
            <KetcherEditor
                staticResourcesUrl={process.env.PUBLIC_URL}
                structServiceProvider={structServiceProvider}
                errorHandler={console.error.bind(console)}
                onInit={handleKetcherInit}/>
            <div style={{display: "flex", justifyContent: 'space-between', padding: '15px 0'}}>
                <button className={'streamlit-button'} style={style} onClick={handleApply}
                        disabled={!ketcher}>Apply
                </button>
                <button className={'streamlit-button'} style={style} onClick={handleReset}
                        disabled={!ketcher}>Reset
                </button>
            </div>
        </div>
    );
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MyComponent);
