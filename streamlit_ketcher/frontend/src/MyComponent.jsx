import {Streamlit, withStreamlitConnection,} from "streamlit-component-lib";
import React, {Suspense, useCallback, useEffect, useRef, useState} from "react";
import 'ketcher-react/dist/index.css'
import useResizeObserver from "@react-hook/resize-observer";
import {Button, ButtonContainer} from "./Button";
import {LoadingPlaceholder} from "./LoadingPlaceholder";

const StreamlitKetcherEditor = React.lazy(() => import('./StreamlitKetcherEditor'));


const MyComponent = function (props) {
    const editorRef = useRef(null)
    const [ketcher, setKetcher] = useState(null)
    const [molecule, setMolecule] = useState(props.args["molecule"])

    useEffect(() => Streamlit.setFrameHeight())
    useResizeObserver(editorRef, (entry) => Streamlit.setFrameHeight())

    const {theme} = props

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
            <Suspense fallback={<LoadingPlaceholder height={props.args['height']}>Loading...</LoadingPlaceholder>}>
                <StreamlitKetcherEditor
                    height={props.args['height']}
                    errorHandler={console.error.bind(console)}
                    onInit={handleKetcherInit}
                />
            </Suspense>
            <ButtonContainer>
                <Button theme={theme} onClick={handleApply}
                        disabled={!ketcher}>Apply
                </Button>
                <Button theme={theme} onClick={handleReset}
                        disabled={!ketcher}>Reset
                </Button>
            </ButtonContainer>
        </div>
    );
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MyComponent);
