import { Canvas, NodeCanvasRenderingContext2D } from "canvas";
export declare type CanvasAndContext = {
    canvas: Canvas | null;
    context: NodeCanvasRenderingContext2D | null;
};
export declare class NodeCanvasFactory {
    constructor();
    create(width: number, height: number): {
        canvas: Canvas;
        context: NodeCanvasRenderingContext2D;
    };
    reset(canvasAndContext: CanvasAndContext, width: number, height: number): void;
    destroy(canvasAndContext: CanvasAndContext): void;
}
