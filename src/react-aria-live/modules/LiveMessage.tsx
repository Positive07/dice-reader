import * as PropTypes from 'prop-types';
import * as React from 'react';
import AnnouncerContext from './AnnouncerContext';
import AnnouncerMessage from './AnnouncerMessage';

interface IProps {
  message: string,
  'aria-live': "polite" | "assertive",
  clearOnUnmount: boolean | "true" | "false"
}

const LiveMessage = (props: IProps) => (
  <AnnouncerContext.Consumer>
    {contextProps => <AnnouncerMessage {...contextProps} {...props} />}
  </AnnouncerContext.Consumer>
);

LiveMessage.propTypes = {
  'aria-live': PropTypes.string.isRequired,
  clearOnUnmount: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['true', 'false']),
  ]),
  message: PropTypes.string.isRequired,
};

export default LiveMessage;
