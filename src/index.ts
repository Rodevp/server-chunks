import express from "express";
import type { Request, Response } from "express";
import fs from "node:fs";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("API funcionando 🚀");
});

app.get("/video", (req: Request, res: Response) => {

    if (!req.headers["range"]) return res.status(400).send("Range header is required");

    const rangeHeader = req.headers["range"];
    const range = rangeHeader?.replace(/bytes=/, "").split("-");

    let stream;
    const chunkSize = 10 ** 6; // 1MB
    const startRangeBytes = Number(range?.[0]);;
    const videoSize = fs.statSync("./assets/es_igual.mp4").size;
    const finalRangeBytes =
        range?.[1] === ""
            ? Math.min(startRangeBytes  + chunkSize, videoSize - 1)
            : Number(range?.[1]);

    if (startRangeBytes > videoSize) return res.status(416).send("Range start exceeds video size");
    if (finalRangeBytes > videoSize - 1) return res.status(416).send("Range end exceeds video size");
    if (startRangeBytes > finalRangeBytes) return res.status(416).send("Inavlied Range");

    stream = fs.createReadStream("./assets/es_igual.mp4", {
        end: finalRangeBytes,
        start: startRangeBytes
    });

    res
        .status(206)
        .header("Content-Range", `bytes ${startRangeBytes}-${finalRangeBytes}/${videoSize}`)
        .header("Accept-Ranges", "bytes")
        .header("Content-Length", `${finalRangeBytes - startRangeBytes + 1}`)
        .header("Content-Type", "video/mp4")

    stream.pipe(res);

});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});