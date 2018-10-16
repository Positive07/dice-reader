declare module "js-aruco" {
  export interface Corner {
    x: number;
    y: number;
  }

  export interface Marker {
    corners: Corner[];
    id: number;
  }

  export class ARDetector {
    detect(data: ImageData): Marker[];
  }

  const module: {
    AR: {
      Detector: typeof ARDetector;
    };
  };

  export default module;
}
