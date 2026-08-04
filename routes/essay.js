const express = require("express");
const router = express.Router();


const { generateAIResponse } = require("../services/aiService");

const essayReviewPrompt = require("../prompts/essayPrompt");


router.post("/review", async (req, res) => {

    try {

        const { essay } = req.body;


        if (!essay) {
            return res.status(400).json({
                error: "Essay text is required"
            });
        }


        const prompt = essayReviewPrompt(essay);


        const result = await generateAIResponse(prompt);


       let parsedReview;

try {
    parsedReview = JSON.parse(result);
} catch(error) {

    console.log("AI did not return valid JSON");
    
    parsedReview = {
        raw_response: result
    };
}


res.json(parsedReview);


    } catch(error){

        console.error(error);

        res.status(500).json({
            error:"Essay review failed"
        });

    }

});


module.exports = router;