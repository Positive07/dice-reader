import * as React from 'react';
import Announcer from './Announcer';
import AnnouncerContext from './AnnouncerContext';

interface IState {
  announceAssertiveMessage: string,
  announcePoliteMessage: string,
  assertiveMessageId: string,
  politeMessageId: string,
  updateFunctions: {
    announceAssertive: (message: string, id: string) => void
    announcePolite: (message: string, id: string) => void
  }
}

class LiveAnnouncer extends React.Component {

  public state: IState;
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      announceAssertiveMessage: '',
      announcePoliteMessage: '',
      assertiveMessageId: '',
      politeMessageId: '',
      updateFunctions: {
        announceAssertive: this.announceAssertive,
        announcePolite: this.announcePolite,
      },
    };
  }

  public announcePolite = (message: string, id: string) => {
    this.setState({
      announcePoliteMessage: message,
      politeMessageId: id ? id : '',
    });
  };

  public announceAssertive = (message: string, id: string) => {
    this.setState({
      announceAssertiveMessage: message,
      assertiveMessageId: id ? id : '',
    });
  };

  public render() {
    const {
      announcePoliteMessage,
      politeMessageId,
      announceAssertiveMessage,
      assertiveMessageId,
      updateFunctions,
    } = this.state;
    return (
      <AnnouncerContext.Provider value={updateFunctions}>
        <Announcer
          assertiveMessageId={assertiveMessageId}
          assertiveMessage={announceAssertiveMessage}
          politeMessage={announcePoliteMessage}
          politeMessageId={politeMessageId}
        />
        {this.props.children}
      </AnnouncerContext.Provider>
    );
  }
}

export default LiveAnnouncer;
