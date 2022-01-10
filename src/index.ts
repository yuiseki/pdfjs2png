import os from "os";
import path from "path";
import { promises as fs } from "fs";
import { createHash } from "crypto";

import {
  getDocument,
  PDFDocumentLoadingTask,
} from "pdfjs-dist/legacy/build/pdf";

import { NodeCanvasFactory } from "./canvasFactory";

// Some PDFs need external cmaps.
const CMAP_URL = "./node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = "./node_modules/pdfjs-dist/standard_fonts/";

export const pdfjs2png = async (pdf: Buffer, filename?: string) => {
  if (process.env.NODE_ENV !== "development") {
    console.debug = (args) => {};
  }
  const data = new Uint8Array(pdf);
  const loadingTask: PDFDocumentLoadingTask = getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
    verbosity: 0,
  });
  const pdfDocument = await loadingTask.promise;
  console.debug("# PDF document loaded: " + filename);
  console.debug("## Number of Pages: " + pdfDocument.numPages);
  const metadata = await pdfDocument.getMetadata();
  console.debug("## Info: ");
  console.debug(JSON.stringify(metadata.info, null, 2));
  if (metadata.metadata) {
    console.debug("## Metadata: ");
    console.debug(JSON.stringify(metadata.metadata.getAll(), null, 2));
  }

  const results = [];
  for await (const pageIdx of [...Array(pdfDocument.numPages).keys()]) {
    const pageNum = pageIdx + 1;
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });

    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(
      viewport.width,
      viewport.height
    );
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory,
    };
    const renderTask = page.render(renderContext);
    await renderTask.promise;
    const image = canvasAndContext.canvas.toBuffer();
    console.debug(image.length);

    const tmpdir = os.tmpdir();
    let tmpfileName = "";
    if (filename) {
      tmpfileName =
        filename.replace(/[^a-z0-9]/gi, "_") + "_page_" + pageNum + ".png";
    } else {
      tmpfileName =
        createHash("md5").update(data).digest("hex") +
        "_page_" +
        pageNum +
        ".png";
    }
    const tmpfilePath = path.join(tmpdir, tmpfileName);
    await fs.writeFile(tmpfilePath, image);
    page.cleanup();
    results.push(tmpfilePath);
  }
  return results;
};
