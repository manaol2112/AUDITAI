import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: ${props => props.maxWidth || '100%'};
  padding: ${props => props.padding || '0 20px'};
  margin: 0 auto;
  min-width:95vw;
`;

const ResponsiveContainer = ({ maxWidth, padding, children }) => {
  return (
    <Container maxWidth={maxWidth} padding={padding}>
      {children}
    </Container>
  );
}

export default ResponsiveContainer;
