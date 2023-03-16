import styled from "@emotion/styled";

interface LoadingPlaceholderProps {
    height: number
}

export const LoadingPlaceholder = styled.div<LoadingPlaceholderProps>((props) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${props.height}px`
}))
