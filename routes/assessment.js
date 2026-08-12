const express = require("express");

const router = express.Router();

const {
    calculateReadiness
} = require("../assessment/scoringEngine");

const {
    normalizeAnswers
} = require("../assessment/answerNormalizer");


/*
=========================================================
ASSESSMENT 1 — INITIAL READINESS
=========================================================

POST /api/assessment/readiness

Expected body:

{
    "guest_token": "local-test-001",

    "answers": {
        ...
    }
}

Flow:

Assessment 1 answers
        ↓
normalizeAnswers()
        ↓
calculateReadiness()
        ↓
Initial readiness result
=========================================================
*/

router.post("/readiness", (req, res) => {

    try {

        /*
        -------------------------------------------------
        Get request data
        -------------------------------------------------
        */

        const answers =
            normalizeAnswers(
                req.body.answers
            );


        const guestToken =
            req.body.guest_token || null;


        /*
        -------------------------------------------------
        Validate answers
        -------------------------------------------------
        */

        if (!answers) {

            return res.status(400).json({

                status: "error",

                message:
                    "Assessment answers are required"

            });

        }


        /*
        -------------------------------------------------
        Calculate Assessment 1 readiness
        -------------------------------------------------
        */

        const result =
            calculateReadiness(
                answers
            );


        /*
        -------------------------------------------------
        Build Assessment 1 response
        -------------------------------------------------
        */

        const assessmentResponse = {

            guest_token:
                guestToken,

            assessment_type:
                "initial_diagnostic",

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


        /*
        -------------------------------------------------
        Return successful response
        -------------------------------------------------
        */

        return res.json({

            status: "success",

            message:
                "Assessment submitted and analyzed by AI successfully.",

            data: {

                assessment:
                    assessmentResponse

            }

        });

    }

    catch (error) {

        console.error(
            "Assessment 1 Error:",
            error
        );


        return res.status(500).json({

            status: "error",

            message:
                "Assessment processing failed"

        });

    }

});


module.exports = router;