import streamlit as st
from streamlit_ketcher import st_ketcher

st.set_page_config(layout="wide")
st.subheader("Component with constant args")

molecule = st.text_input("Molecule", "CCO")
smile_code = st_ketcher(molecule)
st.markdown("Smile code: %s" % smile_code)