const express = require("express");

const router = express.Router();

const {
    getScholarshipRecommendation
} = require("../rag/ragService");


router.post("/recommend", async (req, res)=>{

    try {

        const {
            profile
        } = req.body;


        if(!profile){

            return res.status(400).json({

                status:"error",

                message:
                "Student profile is required"

            });

        }


        const result =
            await getScholarshipRecommendation(
                profile
            );


        return res.json({

            status:"success",

            message:
            "Scholarship recommendation generated successfully",

            data: result

        });


    }
    catch(error){

    // Log the detailed error on the server
    console.error(
        "Scholarship Recommendation Error:",
        error
    );

    // Show a safe fallback message to the user
    return res.status(503).json({

        status: "fallback",

        message:
            "Ally is taking a short break. Your checklist and roadmap are still available."

    });

}
});


module.exports = router;