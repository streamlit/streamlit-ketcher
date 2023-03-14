from pathlib import Path
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
_RELEASE = False

if not _RELEASE:
    _render_component = components.declare_component(
        "streamlit_ketcher",
        url="http://localhost:3000",
    )
else:
    build_dir = Path(__file__).parent / "frontend" / "build"
    _render_component = components.declare_component("streamlit_ketcher", path=build_dir)


def st_ketcher(molecule, key=None):
    """Create a new instance of "my_component".

    Parameters
    ----------
    molecule: str
        # TODO: Update docstring
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
    return _render_component(molecule=molecule, key=key, default=molecule)
