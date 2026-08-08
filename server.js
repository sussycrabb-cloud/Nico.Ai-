import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.NICO_AI
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "NICO AI",
    message: "API is running"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: "You are NICO AI, a helpful and intelligent AI assistant.",
      input: [
        ...history,
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      success: true,
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI request failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`NICO AI running on port ${PORT}`);
});
