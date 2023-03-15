from pathlib import Path

import streamlit.components.v1 as components

__version__ = '0.0.1'

# Create a _IS_DEV constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
_IS_DEV = '__main__' == __name__

if _IS_DEV:
    _render_component = components.declare_component(
        "streamlit_ketcher",
        url="http://localhost:3000",
    )
else:
    build_dir = Path(__file__).parent / "frontend" / "build"
    _render_component = components.declare_component("streamlit_ketcher", path=str(build_dir))


def st_ketcher(molecule, *, height=500, key=None):
    """Create a new instance of "my_component".

    Parameters
    ----------
    molecule: str
        # TODO: Update docstring
    height: int
        The height of the component expressed in pixels.
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    int
        The number of times the component's "Click Me" button has been clicked.
        (This is the value passed to `Streamlit.setComponentValue` on the
        frontend.)

    """
    return _render_component(molecule=molecule, height=height, key=key, default=molecule)


if _IS_DEV:
    import streamlit as st

    st.set_page_config(layout="wide")

    st.subheader("Component with user input")

    DEFAULT_MOL = 'C[N+]1=CC=C(/C2=C3\C=CC(=N3)/C(C3=CC=CC(C(N)=O)=C3)=C3/C=C/C(=C(\C4=CC=[N+](C)C=C4)C4=N/C(=C(/C5=CC=CC(C(N)=O)=C5)C5=CC=C2N5)C=C4)N3)C=C1'

    molecule = st.text_input("Molecule", DEFAULT_MOL)
    smile_code = st_ketcher(molecule)
    st.markdown(f"Smile code: ``{smile_code}``")

    st.write("---")

    st.subheader("Components with custom height")
    st_ketcher('CCO', height=400)
    st_ketcher('CCO', height=800)
