import path from "path";
import { promises as fs } from "fs";

import yargs from "yargs/yargs";
import { pdfjs2png } from ".";

const argv = yargs(process.argv.slice(2))
  .option("stdin", {
    alias: "i",
    description: "Read PDF file data from stdin",
    type: "boolean",
  })
  .help()
  .parseSync();

const main = async () => {
  if (argv.stdin) {
    const buffers = [];
    for await (const chunk of process.stdin) buffers.push(chunk);
    const buffer = Buffer.concat(buffers);
    const results = await pdfjs2png(buffer);
    for await (const result of results) {
      console.log(result);
    }
  } else {
    for await (const filepath of argv._) {
      if (typeof filepath === "string") {
        const filename = path.basename(filepath);
        const fileBuffer = await fs.readFile(filepath);
        const results = await pdfjs2png(fileBuffer, filename);
        for await (const result of results) {
          console.log(result);
        }
      }
    }
  }
};

(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err);
  }
})();
