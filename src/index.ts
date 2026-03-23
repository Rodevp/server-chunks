import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("API funcionando 🚀");
});

app.get("/video", (req: Request, res: Response) => {
    const URL_VIDEO = "../assets/es_igual.mp4";
    
    res.sendFile(URL_VIDEO, { root: __dirname }, () => {
        res.status(404).send("Video no encontrado");
    });

    res.status(200).json({ message: "Video enviado correctamente" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});