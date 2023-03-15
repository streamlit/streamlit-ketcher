from pathlib import Path

import streamlit.components.v1 as components

__version__ = '0.0.1'

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
_RELEASE = TRUE

if not _RELEASE:
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
