"use client";

import * as ort from "onnxruntime-web";
import {
  FaceLandmarker,
  FilesetResolver,
  NormalizedLandmark
} from "@mediapipe/tasks-vision";

class FaceFeatureExtractor {
  extract(landmarks: NormalizedLandmark[]): Float32Array | null {
    if (!landmarks || landmarks.length < 468) return null;
    const lm = landmarks.slice(0, 468);

    const mean = lm.reduce(
      (acc: number[], p) => [acc[0] + p.x, acc[1] + p.y, acc[2] + p.z],
      [0, 0, 0]
    ).map((v: number) => v / lm.length);

    const normalized = lm.map(p => [
      p.x - mean[0],
      p.y - mean[1],
      p.z - mean[2]
    ]);

    const flat = normalized.flat();
    const dist = (a: number[], b: number[]) =>
      Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);

    const left_eye = dist(normalized[159], normalized[145]) / (dist(normalized[33], normalized[133]) + 1e-6);
    const right_eye = dist(normalized[386], normalized[374]) / (dist(normalized[362], normalized[263]) + 1e-6);
    const mouth = dist(normalized[13], normalized[14]) / (dist(normalized[78], normalized[308]) + 1e-6);

    return new Float32Array([...flat, left_eye, right_eye, mouth]);
  }
}

export class DrowsinessSystem {
  private session!: ort.InferenceSession;
  private landmarker!: FaceLandmarker;
  private extractor = new FaceFeatureExtractor();
  private buffer: string[] = [];
  private classNames = ["drowsy", "normal"];
  private lastVideoTime = -1;

  async init() {
    const originalError = console.error;
    const isNoisyLog = (args: any[]) => 
      typeof args[0] === 'string' && (args[0].includes("XNNPACK") || args[0].includes("delegate"));

    console.error = (...args) => { if (!isNoisyLog(args)) originalError(...args); };

    try {
      const response = await fetch("/models/drowsiness-detection.onnx");
      const modelBuffer = await response.arrayBuffer();
      const sessionOptions: ort.InferenceSession.SessionOptions = {
        externalData: [{ path: "drowsiness-detection.onnx.data", data: "/models/drowsiness-detection.onnx.data" }],
      };
      this.session = await ort.InferenceSession.create(modelBuffer, sessionOptions);

      const fileset = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
      this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: "/landmarker/face_landmarker.task", delegate: "GPU" },
        runningMode: "VIDEO"
      });
      console.log("%c [WakeSync] Engine Initialized ✅ ", "color: #00ff00; font-weight: bold;");
    } finally {
      console.error = originalError;
    }
  }

  smooth(label: string): string {
    this.buffer.push(label);
    if (this.buffer.length > 15) this.buffer.shift();
    return this.buffer.slice().sort((a, b) => 
      this.buffer.filter(v => v === a).length - this.buffer.filter(v => v === b).length
    ).pop()!;
  }

  async run(video: HTMLVideoElement, onResult: (label: string) => void) {
    const loop = async () => {
      if (!this.landmarker || !video || !this.session || video.readyState < 2 || video.currentTime === this.lastVideoTime) {
        requestAnimationFrame(loop);
        return;
      }
      this.lastVideoTime = video.currentTime;

      try {
        const result = this.landmarker.detectForVideo(video, performance.now());
        if (result && result.faceLandmarks.length > 0) {
          const features = this.extractor.extract(result.faceLandmarks[0]);
          if (features) {
            const tensor = new ort.Tensor("float32", features, [1, 1407]);
            const outputs = await this.session.run({ [this.session.inputNames[0]]: tensor });
            const data = outputs[this.session.outputNames[0]].data as Float32Array;
            const label = this.smooth(this.classNames[data.indexOf(Math.max(...data))]);
            onResult(label); 
          }
        } else {
          onResult("searching");
        }
      } catch (e) {}
      requestAnimationFrame(loop);
    };
    loop();
  }
}