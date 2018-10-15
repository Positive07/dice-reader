import Aruco, { Marker } from "js-aruco";
import * as React from 'react';
import Camera from './Camera';
import './Detector.css'

const AR = Aruco.AR

const renderMarker = function (this: CanvasRenderingContext2D, marker: Marker) {
  this.strokeStyle = "red";
  this.beginPath();

  const corner = marker.corners.reduce((previous, current, index) => {
    if (index > 0) { this.lineTo(current.x, current.y) }
    this.moveTo(current.x, current.y);

    return {
      x: Math.min(previous.x, current.x),
      y: Math.min(previous.y, current.y)
    };
  }, {x: Infinity, y: Infinity});

  this.closePath();
  this.stroke();

  this.strokeStyle = "green";
  this.strokeRect(marker.corners[0].x - 2, marker.corners[0].y - 2, 4, 4);

  this.strokeStyle = "blue";
  this.lineWidth = 1;
  this.strokeText(marker.id, corner.x, corner.y)
}

export default class Detector extends React.Component {
  public screen?: {
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  }

  public dimensions?: {
    width: number,
    height: number
  }
  public detector = new AR.Detector();

  constructor (props: {}, context?: any) {
    super(props, context)
  }

  public setCanvas (canvas: HTMLCanvasElement | null) {
    if (!canvas) { return; }

    if (this.dimensions) {
      canvas.width  = this.dimensions.width;
      canvas.height = this.dimensions.height;
    }

    const context = canvas.getContext("2d");
    if (!context) { return; }

    this.screen = { canvas, context }
  }

  public setDimensions (width: number, height: number) {
    this.dimensions = { width, height };

    if (this.screen) {
      this.screen.canvas.width  = width;
      this.screen.canvas.height = height;
    }
  }

  public renderFrame (video: HTMLVideoElement, delta: number) {
    if (!this.screen) { return; }

    const {context, canvas} = this.screen
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const markers = this.detector.detect(context.getImageData(0, 0, canvas.width, canvas.height))

    const def = context.globalCompositeOperation;
    context.globalCompositeOperation = "saturation";
    context.fillStyle = "#888";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = def

    markers.forEach(renderMarker, context)
  }

  public render () {
    return <>
      <Camera
        // tslint:disable-next-line:jsx-no-lambda
        onFrame={ (video, delta) => this.renderFrame(video, delta) }
        // tslint:disable-next-line:jsx-no-lambda
        onDimensions={ (w, h) => this.setDimensions(w, h) }
      />
      <canvas
        ref={canvas => this.setCanvas(canvas)}
      />
    </>
  }
}