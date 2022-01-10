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
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const yargs_1 = __importDefault(require("yargs/yargs"));
const _1 = require(".");
const argv = (0, yargs_1.default)(process.argv.slice(2))
    .option("stdin", {
    alias: "i",
    description: "Read PDF file data from stdin",
    type: "boolean",
})
    .help()
    .parseSync();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    if (argv.stdin) {
        const buffers = [];
        try {
            for (var _e = __asyncValues(process.stdin), _f; _f = yield _e.next(), !_f.done;) {
                const chunk = _f.value;
                buffers.push(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) yield _a.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const buffer = Buffer.concat(buffers);
        const results = yield (0, _1.pdfjs2png)(buffer);
        try {
            for (var results_1 = __asyncValues(results), results_1_1; results_1_1 = yield results_1.next(), !results_1_1.done;) {
                const result = results_1_1.value;
                console.log(result);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (results_1_1 && !results_1_1.done && (_b = results_1.return)) yield _b.call(results_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    else {
        try {
            for (var _g = __asyncValues(argv._), _h; _h = yield _g.next(), !_h.done;) {
                const filepath = _h.value;
                if (typeof filepath === "string") {
                    const fileName = path_1.default.basename(filepath);
                    const fileBuffer = yield fs_1.promises.readFile(filepath);
                    const results = yield (0, _1.pdfjs2png)(fileBuffer, fileName);
                    try {
                        for (var results_2 = (e_4 = void 0, __asyncValues(results)), results_2_1; results_2_1 = yield results_2.next(), !results_2_1.done;) {
                            const result = results_2_1.value;
                            console.log(result);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (results_2_1 && !results_2_1.done && (_d = results_2.return)) yield _d.call(results_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_c = _g.return)) yield _c.call(_g);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield main();
    }
    catch (err) {
        console.error(err);
    }
}))();
