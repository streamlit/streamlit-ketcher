import { Streamlit, withStreamlitConnection } from "streamlit-component-lib";
import * as React from "react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import "ketcher-react/dist/index.css";
import useResizeObserver from "@react-hook/resize-observer";
import { Button, ButtonContainer } from "./Button";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact";
import { Ketcher } from "ketcher-core";
import { FixedTheme } from "./Theme";

const StreamlitKetcherEditor = React.lazy(
  () => import("./StreamlitKetcherEditor")
);

interface MyComponentsProps extends ComponentProps {}

const MyComponent = function (props: MyComponentsProps) {
  const editorRef = useRef(null);
  const [ketcher, setKetcher] = useState<Ketcher | null>(null);
  const [molecule, setMolecule] = useState<string>(props.args["molecule"]);

  useEffect(() => Streamlit.setFrameHeight());
  useResizeObserver(editorRef, (entry) => Streamlit.setFrameHeight());

  const theme: FixedTheme = props.theme as unknown as FixedTheme;

  const handleReset = useCallback(async () => {
    if (!ketcher) {
      return;
    }
    await ketcher.setMolecule("");
  }, [ketcher]);

  const handleApply = useCallback(async () => {
    if (!ketcher) {
      return;
    }
    const smile = await ketcher.getSmiles();
    setMolecule(smile);
    Streamlit.setComponentValue(smile);
  }, [ketcher]);

  const handleKetcherInit = useCallback(
    (ketcher: Ketcher) => {
      setKetcher(ketcher);
      if (molecule) {
        ketcher.setMolecule(molecule);
      }
    },
    [molecule]
  );

  return (
    <div ref={editorRef}>
      <Suspense
        fallback={
          <LoadingPlaceholder height={props.args["height"]}>
            Loading...
          </LoadingPlaceholder>
        }
      >
        <StreamlitKetcherEditor
          height={props.args["height"]}
          errorHandler={console.error.bind(console)}
          onInit={handleKetcherInit}
        />
      </Suspense>
      <ButtonContainer>
        <Button theme={theme!} onClick={handleReset} disabled={!ketcher}>
          Reset
        </Button>
        <Button theme={theme!} onClick={handleApply} disabled={!ketcher}>
          Apply
        </Button>
      </ButtonContainer>
    </div>
  );
};

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MyComponent);
