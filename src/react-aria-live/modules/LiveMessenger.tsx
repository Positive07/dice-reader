import * as PropTypes from 'prop-types';
import * as React from 'react';
import AnnouncerContext from './AnnouncerContext';

interface IProps {
  children: (contextProps: {})=>React.ReactNode;
}

const LiveMessenger = ({ children }: IProps) => (
  <AnnouncerContext.Consumer>
    {contextProps => children(contextProps)}
  </AnnouncerContext.Consumer>
);

LiveMessenger.propTypes = {
  children: PropTypes.func.isRequired,
};

export default LiveMessenger;
