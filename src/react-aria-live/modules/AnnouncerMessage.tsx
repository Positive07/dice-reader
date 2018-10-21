import * as PropTypes from 'prop-types';
import { Component } from 'react';
import * as uuidv4 from 'uuid/v4';

interface IProps {
  announceAssertive: (message: string, id: string) => void,
  announcePolite: (message: string, id: string) => void,
  'aria-live': "assertive"|"polite"
  clearOnUnmount: boolean | "true" | "false",
  message: string,
}

class AnnouncerMessage extends Component {
  public static propTypes = {
    announceAssertive: PropTypes.func,
    announcePolite: PropTypes.func,
    'aria-live': PropTypes.string.isRequired,
    clearOnUnmount: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['true', 'false']),
    ]),
    message: PropTypes.string.isRequired,
  };

  public props: IProps

  public componentDidMount() {
    this.announce();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { message } = this.props;
    if (message !== prevProps.message) {
      this.announce();
    }
  }

  public componentWillUnmount() {
    const { clearOnUnmount, announceAssertive, announcePolite } = this.props;
    if (clearOnUnmount === true || clearOnUnmount === 'true') {
      announceAssertive('', '');
      announcePolite('', '');
    }
  }

  public announce = () => {
    const {
      message,
      'aria-live': ariaLive,
      announceAssertive,
      announcePolite,
    } = this.props;
    if (ariaLive === 'assertive') {
      announceAssertive(message || '', uuidv4());
    }
    if (ariaLive === 'polite') {
      announcePolite(message || '', uuidv4());
    }
  };

  public render() {
    return null;
  }
}

export default AnnouncerMessage;
