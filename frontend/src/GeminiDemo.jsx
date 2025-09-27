import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function GeminiDemo() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  async function handleSend() {
    if (!prompt) return;

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const aiPrompt = `
      you are ai assistant meant to refine users' prompts to make them sound formal, and professionals.
      Dont change the contents of the sentence, just make it sound better and appealing to recruiters.
      User message: "${prompt}"
      `;

      const result = await model.generateContent(aiPrompt);
      const responseText = result.response.text();

      setReply(responseText);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setReply("Error: Failed to generate response.");
    }
  }

  return (
    <div>
      <h1>Gemini Chat Demo</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <h2>AI Reply:</h2>
        <p>{reply}</p>
      </div>
    </div>
  );
}

export default GeminiDemo;