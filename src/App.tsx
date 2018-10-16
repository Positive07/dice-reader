import * as React from "react";
import { LiveAnnouncer, LiveMessenger } from "react-aria-live";
import "./App.css";
import Detector from "./Detector";

// import logo from './logo.svg';

type Messenger = (message: string, id: number) => void;
interface IMessengers {
  announcePolite: Messenger;
  announceAssertive: Messenger;
}

class App extends React.Component {
  public render() {
    return (
      <LiveAnnouncer>
        <LiveMessenger>
          {({ announcePolite }: IMessengers) => (
            <Detector
              threshold={1000}
              // tslint:disable-next-line:jsx-no-lambda
              onAdded={(text: string[], time: number) =>
                announcePolite(text.join(", "), time)
              }
            />
          )}
        </LiveMessenger>
      </LiveAnnouncer>
    );
  }
}

export default App;
