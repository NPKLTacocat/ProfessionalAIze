import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function GeminiDemo() {
  const [prompt, setPrompt] = useState("");
  const [example, setExample] = useState("");
  const [reply, setReply] = useState("");

  async function handleSend() {
    if (!prompt) return;
    let realExample;
    if (!example) {
      realExample = `We remain committed to delivering innovative solutions that align 
                           with our clients’ strategic objectives while maintaining the highest 
                           standards of integrity and excellence.`;
    } else {
      realExample = example;
    }

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const aiPrompt = `
      you are ai assistant meant to refine users' prompts to replicate the format of a given sentence
      to rewrite a given prompt. Dont change the contents of the sentence, just take this prompt: "${prompt}" 
      and sty;e it like in this example: "${realExample}". Replicate both tone, typing style, and any other
      factors to make it seem like the new message was written by the same person who wrote the example.  
      Do not include anything in your response but the new message replicating the example's style.
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
        value={example}
        onChange={(e) => setExample(e.target.value)}
        placeholder="Type your example..."
      />

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