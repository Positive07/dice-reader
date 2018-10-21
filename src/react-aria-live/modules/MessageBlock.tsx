import * as PropTypes from 'prop-types';
import * as React from 'react';

const offScreenStyle: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
};

interface IProps {
  message: string;
  'aria-live': 'assertive' | 'polite';
}

const MessageBlock = ({ message, 'aria-live': ariaLive }: IProps) => (
  <div style={offScreenStyle} role="log" aria-live={ariaLive} aria-relevant={"additions text"}>
    {message ? message : ''}
  </div>
);

MessageBlock.propTypes = {
  'aria-live': PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default MessageBlock;
