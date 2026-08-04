const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";

async function generateAIResponse(prompt) {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: process.env.OLLAMA_MODEL || "llama3.2",
            prompt: prompt,
            stream: false
        });

        return response.data.response;

    } catch (error) {
        console.error("AI Service Error:", error.message);
        throw new Error("Failed to communicate with AI model");
    }
}

module.exports = {
    generateAIResponse
};