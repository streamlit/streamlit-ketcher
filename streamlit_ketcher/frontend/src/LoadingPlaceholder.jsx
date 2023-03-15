import styled from "@emotion/styled";

export const LoadingPlaceholder = styled.div((props) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${props.height}px`
}))
