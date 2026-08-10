const express = require("express");

const router = express.Router();

router.get("/simulate-llm-error", async (req, res) => {

    try {

        // Simulate an LLM provider failure
        throw new Error("Simulated LLM provider timeout");

    } catch (error) {

        // Detailed error stays on the server
        console.error(
            "Simulated LLM Error:",
            error
        );

        // Safe message shown to the user
        return res.status(503).json({

            status: "fallback",

            message:
                "Ally is taking a short break. Your checklist and roadmap are still available."

        });

    }

});

module.exports = router;