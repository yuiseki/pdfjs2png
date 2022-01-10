import { Canvas, createCanvas, NodeCanvasRenderingContext2D } from "canvas";

export type CanvasAndContext = {
  canvas: Canvas | null;
  context: NodeCanvasRenderingContext2D | null;
};
export class NodeCanvasFactory {
  constructor() {}

  create(width: number, height: number) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext: CanvasAndContext, width: number, height: number) {
    if (canvasAndContext.canvas === null) {
      throw Error("canvas is not specified");
    }
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: CanvasAndContext) {
    if (canvasAndContext.canvas === null) {
      throw Error("canvas is not specified");
    }
    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}
