import {StandaloneStructServiceProvider} from "ketcher-standalone";
import {Editor as KetcherEditor} from "ketcher-react";
import styled from "@emotion/styled";

const KetcherEditorWrapper = styled.div((props) => ({height: `${props.height}px`}))

KetcherEditorWrapper.defaultProps = {
    height: '500'
};

const structServiceProvider = new StandaloneStructServiceProvider()

export const StreamlitKetcherEditor = ({height, ...rest}) =>
    <KetcherEditorWrapper height={height}>
        <KetcherEditor
            staticResourcesUrl={process.env.PUBLIC_URL}
            structServiceProvider={structServiceProvider}
            {...rest}
        />
    </KetcherEditorWrapper>

export default StreamlitKetcherEditor
