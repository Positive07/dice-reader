import Aruco, { Marker } from "js-aruco";
import * as PropTypes from "prop-types";
import * as React from "react";
import Camera from "./Camera";
import "./Detector.css";

const AR = Aruco.AR;

export interface IDetectorProps {
  onAdded: (id: string[], time: DOMHighResTimeStamp) => void;
  onRemoved: (id: string[], time: DOMHighResTimeStamp) => void;
  threshold: number;
}

interface IMark {
  added?: DOMHighResTimeStamp;
  id: string;
  maxx: number;
  maxy: number;
  minx: number;
  miny: number;

  registered: boolean;
  removed?: DOMHighResTimeStamp;
}

const size = (amin: number, bmin: number, amax: number, bmax: number) => {
  if (amin < bmax && bmin < amax) {
    return Math.max(amin, bmin) - Math.min(amax, bmax);
  }

  return 0;
};

const overlap = (a: IMark, b: IMark) => {
  const width = size(a.minx, b.minx, a.maxx, b.maxx);
  const height = size(a.miny, b.miny, a.maxy, b.maxy);

  return width * height;
};

const renderAndParseMarkers = function(
  this: CanvasRenderingContext2D,
  marker: Marker
): IMark {
  this.strokeStyle = "red";
  this.beginPath();

  const reduced = marker.corners.reduce(
    (previous, current, index) => {
      if (index > 0) {
        this.lineTo(current.x, current.y);
      }
      this.moveTo(current.x, current.y);

      return {
        maxx: Math.max(previous.maxx, current.x),
        maxy: Math.max(previous.maxy, current.y),
        minx: Math.min(previous.minx, current.x),
        miny: Math.min(previous.miny, current.y)
      };
    },
    {
      maxx: 0,
      maxy: 0,
      minx: Infinity,
      miny: Infinity
    }
  );

  this.closePath();
  this.stroke();

  this.strokeStyle = "green";
  this.strokeRect(marker.corners[0].x - 2, marker.corners[0].y - 2, 4, 4);

  this.strokeStyle = "blue";
  this.lineWidth = 1;
  this.strokeText(marker.id.toString(), reduced.minx, reduced.miny);

  return {
    id: marker.id.toString(),
    registered: false,
    ...reduced
  };
};

export default class Detector extends React.Component {
  public static defaultProps = {
    onAdded: (id: string, time: DOMHighResTimeStamp) => {
      return;
    },
    onRemoved: (id: string, time: DOMHighResTimeStamp) => {
      return;
    },
    threshold: 1000
  };

  public static propTypes = {
    onAdded: PropTypes.func,
    onRemoved: PropTypes.func,
    threshold: PropTypes.number
  };
  public screen?: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  };

  public dimensions?: {
    width: number;
    height: number;
  };
  public detector = new AR.Detector();
  public currentMarkers: IMark[] = [];

  public props: IDetectorProps;

  constructor(props: IDetectorProps, context?: any) {
    super(props, context);

    this.renderFrame = this.renderFrame.bind(this);
    this.setDimensions = this.setDimensions.bind(this);
    this.setCanvas = this.setCanvas.bind(this);
  }

  public setCanvas(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      return;
    }

    if (this.dimensions) {
      canvas.width = this.dimensions.width;
      canvas.height = this.dimensions.height;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    this.screen = { canvas, context };
  }

  public setDimensions(width: number, height: number) {
    this.dimensions = { width, height };

    if (this.screen) {
      this.screen.canvas.width = width;
      this.screen.canvas.height = height;
    }
  }

  public renderFrame(video: HTMLVideoElement, time: DOMHighResTimeStamp) {
    if (!this.screen) {
      return;
    }

    const { context, canvas } = this.screen;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const markers = this.detector.detect(
      context.getImageData(0, 0, canvas.width, canvas.height)
    );

    const def = context.globalCompositeOperation;
    context.globalCompositeOperation = "saturation";
    context.fillStyle = "#888888";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = def;

    const marks = markers.map(renderAndParseMarkers, context);
    this.getMarkerState(marks, time);
  }

  public getMarkerState(markers: IMark[], time: DOMHighResTimeStamp) {
    const state: IMark[] = [];
    const added: string[] = [];
    const removed: string[] = [];

    this.currentMarkers.forEach(mark => {
      const match: IMark | null = markers.reduce(
        (previous: IMark | null, current: IMark) => {
          if (current.id !== mark.id) {
            return previous;
          }

          if (previous && overlap(mark, previous) >= overlap(mark, current)) {
            return previous;
          }

          return current;
        },
        null
      );

      if (match) {
        if (
          mark.added &&
          !mark.registered &&
          time - mark.added > this.props.threshold
        ) {
          added.push(mark.id);
          mark.registered = true;
        }

        state.push({
          added: mark.added,
          ...match,
          registered: mark.registered
        });

        markers.splice(markers.indexOf(match), 1);
      } else if (!mark.removed) {
        state.push({
          removed: time,
          ...mark
        });
      } else if (time - mark.removed < this.props.threshold) {
        state.push(mark);
      } else if (mark.registered) {
        removed.push(mark.id);
      }
    });

    markers.forEach(mark => {
      state.push({
        added: time,
        ...mark
      });
    });

    if (added.length > 0) {
      this.props.onAdded(added, time);
    }
    if (removed.length > 0) {
      this.props.onRemoved(removed, time);
    }

    this.currentMarkers = state;
  }

  public render() {
    return (
      <>
        <Camera onFrame={this.renderFrame} onDimensions={this.setDimensions} />
        <canvas ref={this.setCanvas} />
      </>
    );
  }
}
