import {Streamlit, withStreamlitConnection,} from "streamlit-component-lib";
import {useCallback, useEffect, useRef, useState} from "react";
import {Editor as KetcherEditor} from 'ketcher-react'
import {StandaloneStructServiceProvider} from 'ketcher-standalone'
import 'ketcher-react/dist/index.css'
import useResizeObserver from "@react-hook/resize-observer";
import styled from '@emotion/styled'
import {Button, ButtonContainer} from "./Button";

const structServiceProvider = new StandaloneStructServiceProvider()


const KetcherEditorWrapper = styled.div((props) => ({height: `${props.height}px`}))

KetcherEditorWrapper.defaultProps = {
    height: '500'
};

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
            <KetcherEditorWrapper height={props.args['height']}>
                <KetcherEditor
                    staticResourcesUrl={process.env.PUBLIC_URL}
                    structServiceProvider={structServiceProvider}
                    errorHandler={console.error.bind(console)}
                    onInit={handleKetcherInit}/>
            </KetcherEditorWrapper>

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
