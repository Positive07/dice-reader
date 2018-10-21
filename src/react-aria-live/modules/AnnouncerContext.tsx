import * as React from 'react';

interface IContext {
  announceAssertive: (message: string, id: string) => void,
  announcePolite: (message: string, id: string) => void,
}

const AnnouncerContext = React.createContext({}) as React.Context<IContext>;

export default AnnouncerContext;
