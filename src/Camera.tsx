import * as PropTypes from "prop-types";
import * as React from "react";
import './Camera.css';

export interface IProps {
  onDimensions: (width: number, height: number) => void,
  onFrame: (video: HTMLVideoElement, delta: number) => void
}

type IUserMedia = (
  constraints: MediaStreamConstraints,
  resolve: (stream: MediaStream) => void,
  reject: (e: any) => void
) => void

const hasGetUserMedia = () => {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    (navigator as any).getUserMedia       as IUserMedia||
    (navigator as any).webkitGetUserMedia as IUserMedia||
    (navigator as any).mozGetUserMedia    as IUserMedia||
    (navigator as any).msGetUserMedia     as IUserMedia
  );
};

const getUserMedia = (
  constraints: MediaStreamConstraints
): Promise<MediaStream> => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  } else {
    const prefixed =
      (navigator as any).getUserMedia ||
      (navigator as any).mozGetUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).msGetUserMedia;

    if (!prefixed) {
      return Promise.reject(
        new Error("Este navegador no tiene acceso a la camara")
      );
    }

    return new Promise((resolve, reject) => {
      prefixed.call(navigator, constraints, resolve, reject);
    });
  }
};

export default class Camera extends React.Component {

  public static defaultProps = {
    onDimensions: (width: number, height: number) => { return; },
    onFrame: (video: HTMLVideoElement, delta: number) => { return; }
  }

  public static propTypes = {
    onDimensions: PropTypes.func,
    onFrame: PropTypes.func
  }

  public static mountedInstances: Camera[] = []
  public static userMediaRequested = false

  public state: {
    hasUserMedia: boolean;
    src?: string;
  };

  public props: IProps;
  public video: HTMLVideoElement | null;
  public stream: MediaStream;
  public rafId: number;
  public isActive: boolean;
  public lastInvocationMs: DOMHighResTimeStamp;

  constructor(props: IProps, context?: any) {
    super(props, context);
    this.state = {
      hasUserMedia: false
    };
  }

  public componentDidMount() {
    if (!hasGetUserMedia()) {
      return;
    }

    Camera.mountedInstances.push(this);

    if (!this.state.hasUserMedia && !Camera.userMediaRequested) {
      this.requestUserMedia();
    }
  }

  public componentWillUnmount() {
    const index = Camera.mountedInstances.indexOf(this);
    Camera.mountedInstances.splice(index, 1);

    Camera.userMediaRequested = false;
    if (
      Camera.mountedInstances.length === 0 &&
      this.state.hasUserMedia &&
      this.stream
    ) {

      if (this.stream.getVideoTracks && this.stream.getAudioTracks) {
        this.stream.getVideoTracks().map(track => track.stop());
        this.stream.getAudioTracks().map(track => track.stop());
      } else {
        this.stream.stop();
      }

      if (this.state.src) {
        window.URL.revokeObjectURL(this.state.src);
      }
    }
  }

  public async requestUserMedia() {
    try {
      Camera.userMediaRequested = true;

      const stream = await getUserMedia({
        audio: false,
        video: {
          facingMode: {ideal: "environment"},         
        }
      });

      Camera.mountedInstances.forEach(instance =>
        instance.onUserMedia(stream)
      );
    } catch (e) {
      Camera.mountedInstances.forEach(instance => instance.onUserMediaError(e));
    }
  }
  public onUserMediaError(e: any) {
    if (this.video) {
      this.setState({ hasUserMedia: false });
    }
  }

  public onUserMedia(stream: MediaStream) {
    if (!this.video) {
      return;
    }

    this.stream = stream;

    try {
      this.video.srcObject = stream;
      this.setState({ hasUserMedia: true });
    } catch (error) {
      this.setState({
        hasUserMedia: true,
        src: window.URL.createObjectURL(stream)
      });
    }
  
    this.video.onloadedmetadata = () => this.metadataloaded();
    this.startAnimation()
  }

  public endAnimation() {
    cancelAnimationFrame(this.rafId);

    this.isActive = false;
  }

  public startAnimation() {
    if (!this.isActive) {
      this.isActive = true;
      this.rafId = requestAnimationFrame(t => this.loop(t));
    }
  }

  public loop (time: DOMHighResTimeStamp) {
    if (!this.isActive || !this.video ) { return; }

    let delta = 0;
    if (this.lastInvocationMs) {
      delta = time - this.lastInvocationMs
    }
  
    this.lastInvocationMs = time

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA){
      this.props.onFrame(this.video, delta)
    }

    this.rafId = requestAnimationFrame(t => this.loop(t));
  }

  public metadataloaded () {
    if (this.video && this.video.videoHeight && this.video.videoWidth) {
      this.props.onDimensions(this.video.videoWidth, this.video.videoHeight);
    }
  }

  public render() {
    return <video
      autoPlay={true}
      playsInline={true}
      src={this.state.src}
      ref={video => { this.video = video; }}
    />
  }
}