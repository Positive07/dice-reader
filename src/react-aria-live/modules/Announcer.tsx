import * as PropTypes from 'prop-types';
import * as React from 'react';
import MessageBlock from './MessageBlock';

interface IState {
  assertiveMessage1: string,
  assertiveMessage2: string,
  oldAssertiveMessage: string,
  oldAssertiveMessageId: string,
  oldPoliteMessageId: string,
  oldPolitemessage: string,
  politeMessage1: string,
  politeMessage2: string,
  setAlternateAssertive: false,
  setAlternatePolite: false,
}

interface IProps {
  assertiveMessage?: string,
  assertiveMessageId?: string,
  politeMessage?: string,
  politeMessageId?: string,
}

class Announcer extends React.Component<IProps, any> {
  public static propTypes = {
    assertiveMessage: PropTypes.string,
    politeMessage: PropTypes.string,
  };

  public static getDerivedStateFromProps(nextProps: IProps, state: IState) {
    const {
      oldPolitemessage,
      oldPoliteMessageId,
      oldAssertiveMessage,
      oldAssertiveMessageId,
    } = state;
    const {
      assertiveMessage,
      politeMessage,

      assertiveMessageId,
      politeMessageId,
    } = nextProps;

    if (
      oldPolitemessage !== politeMessage ||
      oldPoliteMessageId !== politeMessageId
    ) {
      return {
        oldPoliteMessageId: politeMessageId,
        oldPolitemessage: politeMessage,
        politeMessage1: state.setAlternatePolite ? '' : politeMessage,
        politeMessage2: state.setAlternatePolite ? politeMessage : '',
        setAlternatePolite: !state.setAlternatePolite,
      };
    }

    if (
      oldAssertiveMessage !== assertiveMessage ||
      oldAssertiveMessageId !== assertiveMessageId
    ) {
      return {
        assertiveMessage1: state.setAlternateAssertive ? '' : assertiveMessage,
        assertiveMessage2: state.setAlternateAssertive ? assertiveMessage : '',
        oldAssertiveMessage: assertiveMessage,
        oldAssertiveMessageId: assertiveMessageId,
        setAlternateAssertive: !state.setAlternateAssertive,
      };
    }

    return null;
  }

  public state: IState = {
    assertiveMessage1: '',
    assertiveMessage2: '',
    oldAssertiveMessage: '',
    oldAssertiveMessageId: '',
    oldPoliteMessageId: '',
    oldPolitemessage: '',
    politeMessage1: '',
    politeMessage2: '',
    setAlternateAssertive: false,
    setAlternatePolite: false,
  };

  public constructor (props: IProps) {
    super(props);
  }

  public render() {
    const {
      assertiveMessage1,
      assertiveMessage2,
      politeMessage1,
      politeMessage2,
    } = this.state;
    return (
      <div>
        <MessageBlock aria-live="assertive" message={assertiveMessage1} />
        <MessageBlock aria-live="assertive" message={assertiveMessage2} />
        <MessageBlock aria-live="polite" message={politeMessage1} />
        <MessageBlock aria-live="polite" message={politeMessage2} />
      </div>
    );
  }
}

export default Announcer;
