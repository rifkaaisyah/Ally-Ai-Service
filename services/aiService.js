const axios = require("axios");

const OLLAMA_GENERATE_URL =
    "http://localhost:11434/api/generate";

const OLLAMA_EMBEDDING_URL =
    "http://localhost:11434/api/embeddings";


async function generateAIResponse(prompt) {
    try {
        const response = await axios.post(OLLAMA_GENERATE_URL, {
            model: process.env.OLLAMA_MODEL || "llama3.2",
            prompt: prompt,
            stream: false
        });

        return response.data.response;

    } catch (error) {
        console.error("AI Generation Error:", error.message);
        throw new Error("Failed to communicate with AI model");
    }
}



async function generateEmbedding(text) {
    try {
        const response = await axios.post(
            OLLAMA_EMBEDDING_URL,
            {
                model:
                    process.env.OLLAMA_EMBEDDING_MODEL ||
                    "nomic-embed-text",

                prompt: text
            }
        );

        return response.data.embedding;

    } catch (error) {
        console.error("Embedding Error:", error.message);
        throw new Error("Failed to generate embedding");
    }
}



module.exports = {
    generateAIResponse,
    generateEmbedding
};