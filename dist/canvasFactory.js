"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeCanvasFactory = void 0;
const canvas_1 = require("canvas");
class NodeCanvasFactory {
    constructor() { }
    create(width, height) {
        const canvas = (0, canvas_1.createCanvas)(width, height);
        const context = canvas.getContext("2d");
        return {
            canvas,
            context,
        };
    }
    reset(canvasAndContext, width, height) {
        if (canvasAndContext.canvas === null) {
            throw Error("canvas is not specified");
        }
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }
    destroy(canvasAndContext) {
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
exports.NodeCanvasFactory = NodeCanvasFactory;
