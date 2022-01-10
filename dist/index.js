"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfjs2png = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const pdf_1 = require("pdfjs-dist/legacy/build/pdf");
const canvasFactory_1 = require("./canvasFactory");
// Some PDFs need external cmaps.
const CMAP_URL = "./node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = "./node_modules/pdfjs-dist/standard_fonts/";
const pdfjs2png = (pdf, filename) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    if (process.env.NODE_ENV !== "development") {
        console.debug = (args) => { };
    }
    const data = new Uint8Array(pdf);
    const loadingTask = (0, pdf_1.getDocument)({
        data,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        standardFontDataUrl: STANDARD_FONT_DATA_URL,
        verbosity: 0,
    });
    const pdfDocument = yield loadingTask.promise;
    console.debug("# PDF document loaded: " + filename);
    console.debug("## Number of Pages: " + pdfDocument.numPages);
    const metadata = yield pdfDocument.getMetadata();
    console.debug("## Info: ");
    console.debug(JSON.stringify(metadata.info, null, 2));
    if (metadata.metadata) {
        console.debug("## Metadata: ");
        console.debug(JSON.stringify(metadata.metadata.getAll(), null, 2));
    }
    const results = [];
    try {
        for (var _b = __asyncValues([...Array(pdfDocument.numPages).keys()]), _c; _c = yield _b.next(), !_c.done;) {
            const pageIdx = _c.value;
            const pageNum = pageIdx + 1;
            const page = yield pdfDocument.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.0 });
            const canvasFactory = new canvasFactory_1.NodeCanvasFactory();
            const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
            const renderContext = {
                canvasContext: canvasAndContext.context,
                viewport,
                canvasFactory,
            };
            const renderTask = page.render(renderContext);
            yield renderTask.promise;
            const image = canvasAndContext.canvas.toBuffer();
            console.debug(image.length);
            const tmpdir = os_1.default.tmpdir();
            let tmpfileName = "";
            if (filename) {
                tmpfileName =
                    filename.replace(/[^a-z0-9]/gi, "_") + "_page_" + pageNum + ".png";
            }
            else {
                tmpfileName =
                    (0, crypto_1.createHash)("md5").update(data).digest("hex") +
                        "_page_" +
                        pageNum +
                        ".png";
            }
            const tmpfilePath = path_1.default.join(tmpdir, tmpfileName);
            yield fs_1.promises.writeFile(tmpfilePath, image);
            page.cleanup();
            results.push(tmpfilePath);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return results;
});
exports.pdfjs2png = pdfjs2png;
