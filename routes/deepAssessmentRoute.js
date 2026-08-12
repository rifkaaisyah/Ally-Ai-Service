const express = require("express");

const router = express.Router();

const {
    analyzeDeepAssessment
} = require("../services/deepAssessmentService");


/*
=========================================================
ASSESSMENT 2 — DEEP ASSESSMENT
=========================================================

POST /api/assessment/deep

Expected body:

{
    "answers": {
        ...
    },

    "uploads": {}
}

Flow:

Assessment 2 answers
        ↓
analyzeDeepAssessment()
        ↓
student profile
        ↓
revised readiness
        ↓
scholarship recommendation
=========================================================
*/

router.post("/deep", async (req, res) => {

    try {

        /*
        -------------------------------------------------
        Get request data
        -------------------------------------------------
        */

        const {
            answers,
            uploads
        } = req.body;


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
        Run Assessment 2
        -------------------------------------------------
        */

        const result =
            await analyzeDeepAssessment(
                answers,
                uploads || {}
            );


        /*
        -------------------------------------------------
        Validate result
        -------------------------------------------------
        */

        if (!result) {

            throw new Error(
                "Deep assessment returned no result"
            );

        }


        /*
        -------------------------------------------------
        Validate student profile
        -------------------------------------------------
        */

        if (
            !result.profile ||
            !result.profile.student_profile
        ) {

            console.error(
                "Deep assessment result is missing student profile:",

                JSON.stringify(
                    result,
                    null,
                    2
                )
            );


            throw new Error(
                "Deep assessment did not return a valid student profile"
            );

        }


        /*
        -------------------------------------------------
        Validate revised readiness
        -------------------------------------------------
        */

        const revisedPercentage =
            Number(
                result.assessment?.revised_percentage
            );


        if (
            Number.isNaN(
                revisedPercentage
            )
        ) {

            throw new Error(
                "Deep assessment did not return a valid revised readiness percentage"
            );

        }


        /*
        -------------------------------------------------
        Return Assessment 2
        -------------------------------------------------
        */

        return res.json({

            status: "success",

            message:
                "Deep assessment analyzed successfully",

            data: {

                assessment:
                    result.assessment || null,

                profile:
                    result.profile || null,

                student_profile:
                    result.profile.student_profile || null

            }

        });

    }

    catch (error) {

        console.error(
            "Deep Assessment Error:",
            error
        );


        return res.status(500).json({

            status: "error",

            message:
                error.message ||
                "Deep assessment processing failed"

        });

    }

});


module.exports = router;