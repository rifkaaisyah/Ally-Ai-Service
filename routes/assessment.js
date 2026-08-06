const express = require("express");

const router = express.Router();

const {
    calculateReadiness
} = require("../assessment/scoringEngine");

const {
    normalizeAnswers
} = require("../assessment/answerNormalizer");



router.post("/readiness", (req, res) => {

    try {

        const answers =
    normalizeAnswers(req.body.answers);

        const guestToken = req.body.guest_token || null;


        if (!answers) {

            return res.status(400).json({

                status: "error",

                message: "Assessment answers are required"

            });

        }


        // Existing Assessment 1 engine
        const result = calculateReadiness(answers);



        const assessmentResponse = {

            guest_token: guestToken,

            assessment_type: "initial_diagnostic",


            readiness_percentage:
                result.readiness_percentage,


            readiness_level:
                result.readiness_level,


            reason:
                result.reason,


            academic_score:
                result.categories.academic,


            scholarship_goal_score:
                result.categories.scholarship_goal,


            leadership_score:
                result.categories.leadership,


            achievements_score:
                result.categories.achievements,


            english_score:
                result.categories.english,


            application_score:
                result.categories.application,


            strengths_mapping:
                result.strengths,


            improvements_mapping:
                result.improvements

        };



        res.json({

            status: "success",

            message:
                "Assessment submitted and analyzed by AI successfully.",


            data: {

                assessment: assessmentResponse

            }

        });



    } catch(error) {

        console.error(error);


        res.status(500).json({

            status:"error",

            message:"Assessment processing failed"

        });

    }

});



module.exports = router;