# pdfjs2png - Simple CLI tool and npm package convert PDF file into png images with pdf.js and node-canvas

## Install

If you want to use pdfjs2png as command, install with `-g` option.

```bash
npm i -g pdfjs2png
```

Or if you want to use pdfjs2png as npm package in your Node.js project, just install.

```bash
npm i pdfjs2png
```

## Basic Usage as command

You can use `pdfjs2png` command if you have install with `-g` option.

The following command:

```bash
pdfjs2png test/helloworld.pdf
```

will output tmp file path of converted images to stdout:

```bash
/tmp/helloworld_pdf_page_1.png
```

### Advanced usage

`pdfjs2png` command supports multiple CLI arguments and stdin.

Try below commands:

```bash
echo test/helloworld.pdf test/20211026_news_gov_cloud_01.pdf | xargs pdfjs2png
cat test/helloworld.pdf | pdfjs2png -i
```

## Basic Usage as package

```typescript
import path from "path";
import { promises as fs } from "fs";
import { pdfjs2png } from "pdfjs2png";

const filename = path.basename(filepath);
const fileBuffer = await fs.readFile(filepath);
const results = await pdfjs2png(fileBuffer, filename);
// results is an array of string of tmp file path of PDF pages.
console.log(results);
```

## Development

```bash
npm ci
npm run build
npm link
NODE_ENV=development pdfjs2png test/helloworld.pdf
```
