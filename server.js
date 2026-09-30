import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        let response;

for (let attempt = 1; attempt <= 3; attempt++) {
    try {
        response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message
        });

        break;
    } catch (error) {
        if (error.status === 503 && attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, attempt * 5000));
        } else {
            throw error;
        }
    }
}

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

const server = app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
    console.error("Server error:", error);
});