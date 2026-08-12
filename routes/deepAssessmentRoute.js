const express = require("express");

const router = express.Router();

const {
    analyzeDeepAssessment
} = require("../services/deepAssessmentService");



router.post("/deep", async (req, res) => {

    try {

        const {
            answers,
            uploads
        } = req.body;



        // ---------------------------------------------------------
        // 1. Validate answers
        // ---------------------------------------------------------

        if (!answers) {

            return res.status(400).json({

                status: "error",

                message:
                    "Assessment answers are required"

            });

        }



        // ---------------------------------------------------------
        // 2. Run deep assessment
        // ---------------------------------------------------------

        const result =
            await analyzeDeepAssessment(
                answers,
                uploads || {}
            );



        // ---------------------------------------------------------
        // 3. Validate result
        //
        // The journey engine needs the student profile.
        // ---------------------------------------------------------

        if (!result) {

            throw new Error(
                "Deep assessment returned no result"
            );

        }



        if (!result.profile) {

            console.error(
                "Deep assessment result is missing profile:",
                JSON.stringify(
                    result,
                    null,
                    2
                )
            );

            throw new Error(
                "Deep assessment did not return a student profile"
            );

        }



        // ---------------------------------------------------------
        // 4. Return assessment + profile
        //
        // IMPORTANT:
        // Previously this route returned ONLY:
        //
        // data: {
        //     assessment: result.assessment
        // }
        //
        // That caused /api/journey to fail because it could not
        // find the student profile.
        // ---------------------------------------------------------

        return res.json({

            status: "success",

            message:
                "Deep assessment analyzed successfully",

            data: {

                // Assessment result
                assessment:
                    result.assessment || null,


                // Full profile object
                profile:
                    result.profile || null,


                // Convenient direct access for consumers
                // that expect student_profile.
                student_profile:
                    result.profile?.student_profile || null

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
                error.message

        });

    }

});



module.exports = router;