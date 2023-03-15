import {Streamlit, withStreamlitConnection,} from "streamlit-component-lib";
import {useCallback, useEffect, useRef, useState} from "react";
import {Editor as KetcherEditor} from 'ketcher-react'
import {StandaloneStructServiceProvider} from 'ketcher-standalone'
import 'ketcher-react/dist/index.css'
import useResizeObserver from "@react-hook/resize-observer";
import styled from '@emotion/styled'
import {transparentize} from "color2k";

const structServiceProvider = new StandaloneStructServiceProvider()


const Button = styled.button(
    ({theme}) => ({
        // StyledBaseButton styles
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        // fontWeight: theme.fontWeights.normal,
        fontWeight: 400,
        // padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        padding: '0.25rem 0.75rem',
        // borderRadius: theme.radii.md,
        borderRadius: '0.25rem',
        margin: 0,
        // lineHeight: theme.lineHeights.base,
        lineHeight: 1.6,
        color: "inherit",
        // width: fluidWidth ? "100%" : "auto",
        width: 'auto',
        userSelect: "none",
        "&:focus": {
            boxShadow: `0 0 0 0.2rem ${transparentize(theme.primaryColor, 0.5)}`,
            outline: "none",
        },

        // StyledSecondaryButton styles
        backgroundColor: theme.lightenedBg05,
        border: `1px solid ${theme.fadedText10}`,
        "&:hover": {
            borderColor: theme.primaryColor,
            color: theme.primaryColor,
        },
        "&:active": {
            color: 'white',
            borderColor: theme.primaryColor,
            backgroundColor: theme.primaryColor,
        },
        "&:focus:not(:active)": {
            borderColor: theme.primaryColor,
            color: theme.primaryColor,
        },
        "&:disabled, &:disabled:hover, &:disabled:active": {
            borderColor: theme.fadedText10,
            backgroundColor: 'transparent',
            color: theme.fadedText40,
            cursor: "not-allowed",
        },
    })
)

const ButtonContainer = styled.div(() => ({display: "flex", justifyContent: 'space-between', padding: '1rem 0'}))

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
