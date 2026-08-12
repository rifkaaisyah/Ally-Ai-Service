const express = require("express");

const router = express.Router();

const {
    analyzeDeepAssessment
} = require("../services/deepAssessmentService");

const {
    planTimeline
} = require("../services/timelinePlanner");

const {
    planJourney
} = require("../services/journeyPlanner");

const {
    generateValleys
} = require("../services/valleyGenerator");

const {
    loadJourney,
    saveJourney,
    journeyExists
} = require("../services/journeyStore");

const {
    submitTaskAnswer
} = require("../services/journeyTaskService");



/*
=========================================================
CREATE JOURNEY

POST /api/journey

Expected body:

{
    "studentId": "student-001",

    "answers": {
        ...
    },

    "uploads": {},

    "scholarship": {
        "id": "chevening-001",
        "name": "Chevening Scholarship"
    }
}

Flow:

Assessment 2
    ↓
Deep Assessment Profile
    ↓
Readiness
    ↓
Journey Planner
    ↓
Valleys + Tasks
    ↓
Timeline
    ↓
Save Journey
=========================================================
*/


router.post(
    "/",
    async (req, res) => {

        try {

            const {
                studentId,
                answers,
                uploads,
                scholarship
            } = req.body;



            /*
            -------------------------------------------------
            Validate student ID
            -------------------------------------------------
            */

            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "studentId is required"

                });

            }



            /*
            -------------------------------------------------
            Validate answers
            -------------------------------------------------
            */

            if (
                !answers ||
                typeof answers !== "object" ||
                Object.keys(answers).length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "answers are required"

                });

            }



            /*
            -------------------------------------------------
            Validate scholarship
            -------------------------------------------------
            */

            if (!scholarship) {

                return res.status(400).json({

                    success: false,

                    error:
                        "scholarship is required"

                });

            }



            /*
            -------------------------------------------------
            If this student already has a journey,
            return the existing journey.

            This prevents completed progress from
            being destroyed by generating a new journey.
            -------------------------------------------------
            */

            if (
                journeyExists(
                    studentId
                )
            ) {

                const existingJourney =
                    loadJourney(
                        studentId
                    );


                return res.json({

                    success: true,

                    existing: true,

                    message:
                        "Journey already exists.",

                    journey:
                        existingJourney

                });

            }



            /*
            =================================================
            1. ANALYZE ASSESSMENT 2
            =================================================

            IMPORTANT:

            analyzeDeepAssessment() is async.

            Therefore we MUST use await here.

            Without await:

                deepAssessment = Promise

            With await:

                deepAssessment = actual result

            =================================================
            */

            const deepAssessment =
                await analyzeDeepAssessment(
                    answers,
                    uploads || {}
                );



            /*
            -------------------------------------------------
            Verify deep assessment result
            -------------------------------------------------
            */

            if (!deepAssessment) {

                throw new Error(
                    "Deep assessment returned no result"
                );

            }



            /*
            -------------------------------------------------
            Get generated student profile
            -------------------------------------------------
            */

            const profile =
                deepAssessment.profile;


            if (!profile) {

                console.error(
                    "Deep assessment result:",
                    JSON.stringify(
                        deepAssessment,
                        null,
                        2
                    )
                );

                throw new Error(
                    "Deep assessment did not return a student profile"
                );

            }



            /*
            =================================================
            2. GET CALCULATED ASSESSMENT 2 READINESS
            =================================================

            Readiness comes directly from Assessment 2.

            The frontend does NOT send readiness.
            =================================================
            */

            const calculatedReadiness =
                Number(
                    deepAssessment
                        ?.assessment
                        ?.revised_percentage
                );


            if (
                Number.isNaN(
                    calculatedReadiness
                )
            ) {

                throw new Error(
                    "Assessment 2 did not return a valid revised readiness percentage"
                );

            }



            /*
            -------------------------------------------------
            Put calculated readiness into student profile.
            -------------------------------------------------
            */

            profile.readiness =
                calculatedReadiness;



            /*
            =================================================
            3. PLAN JOURNEY
            =================================================
            */

            const journeyPlan =
                planJourney(
                    profile,
                    scholarship
                );



            /*
            =================================================
            4. GENERATE VALLEYS + TASKS
            =================================================
            */

            let journey =
                generateValleys(
                    profile.student_profile,
                    journeyPlan,
                    scholarship
                );



            /*
            =================================================
            5. EXPOSE ASSESSMENT 2 READINESS
            =================================================
            */

            journey.readiness =
                calculatedReadiness;


            journey.assessment =
                journey.assessment || {};


            journey.assessment.assessment_number =
                2;


            journey.assessment.revised_percentage =
                calculatedReadiness;



            /*
            =================================================
            6. PLAN TIMELINE
            =================================================

            Timeline planner uses:

            - scholarship deadline
            - current date
            - valley order
            - current/locked status
            - task completion
            =================================================
            */

            journey =
                planTimeline(
                    journey
                );



            /*
            -------------------------------------------------
            Make sure readiness/assessment data survives
            timeline planning.
            -------------------------------------------------
            */

            journey.readiness =
                calculatedReadiness;


            journey.assessment =
                journey.assessment || {};


            journey.assessment.assessment_number =
                2;


            journey.assessment.revised_percentage =
                calculatedReadiness;



            /*
            =================================================
            7. SAVE COMPLETE JOURNEY
            =================================================
            */

            saveJourney(
                studentId,
                journey
            );



            /*
            =================================================
            8. RETURN COMPLETE JOURNEY
            =================================================
            */

            return res.status(201).json({

                success: true,

                existing: false,

                message:
                    "Journey created successfully.",

                journey

            });

        }

        catch (error) {

            console.error(
                "Journey creation error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Failed to create journey"

            });

        }

    }
);



/*
=========================================================
GET JOURNEY

GET /api/journey/:studentId

Loads the student's saved journey.
=========================================================
*/


router.get(
    "/:studentId",
    async (req, res) => {

        try {

            const {
                studentId
            } = req.params;


            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "studentId is required"

                });

            }


            const journey =
                loadJourney(
                    studentId
                );


            if (!journey) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Journey not found"

                });

            }


            return res.json({

                success: true,

                journey

            });

        }

        catch (error) {

            console.error(
                "Journey loading error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Failed to load journey"

            });

        }

    }
);



/*
=========================================================
SUBMIT TASK ANSWER

POST /api/journey/task/evaluate

Expected body:

{
    "studentId": "student-001",
    "taskId": "research-collect",
    "answer": "..."
}
=========================================================
*/


router.post(
    "/task/evaluate",
    async (req, res) => {

        try {

            const {
                studentId,
                taskId,
                answer
            } = req.body;



            /*
            -------------------------------------------------
            Validate student ID
            -------------------------------------------------
            */

            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "studentId is required"

                });

            }



            /*
            -------------------------------------------------
            Validate task ID
            -------------------------------------------------
            */

            if (!taskId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "taskId is required"

                });

            }



            /*
            -------------------------------------------------
            Validate answer
            -------------------------------------------------
            */

            if (
                !answer ||
                !answer.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "answer is required"

                });

            }



            /*
            -------------------------------------------------
            Load THIS student's journey
            -------------------------------------------------
            */

            const journey =
                loadJourney(
                    studentId
                );


            if (!journey) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Journey not found"

                });

            }



            /*
            -------------------------------------------------
            Evaluate answer against student's journey
            -------------------------------------------------
            */

            const result =
                await submitTaskAnswer({

                    journey,

                    taskId,

                    studentAnswer:
                        answer,

                    scholarship:
                        journey.scholarship

                });



            /*
            -------------------------------------------------
            Save updated journey
            -------------------------------------------------
            */

            saveJourney(
                studentId,
                result.journey
            );



            /*
            -------------------------------------------------
            Return evaluation + updated task + journey
            -------------------------------------------------
            */

            return res.json({

                success: true,

                evaluation:
                    result.evaluation,

                task:
                    result.task,

                journey:
                    result.journey

            });

        }

        catch (error) {

            console.error(
                "Journey task evaluation error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Failed to evaluate journey task"

            });

        }

    }
);



module.exports = router;