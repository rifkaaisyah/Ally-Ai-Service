const express = require("express");

const router = express.Router();

const {
    analyzeDeepAssessment
} = require("../services/deepAssessmentService");

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
=====================================================
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

Assessment 2 answers
        ↓
Deep Assessment
        ↓
revised_percentage
        ↓
student profile
        ↓
Journey Planner
        ↓
Valley Generator
        ↓
Save Journey
=====================================================
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

            if (!answers) {

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

            The Deep Assessment calculates readiness.

            answers
                ↓
            analyzeDeepAssessment()
                ↓
            revised_percentage = 84
            =================================================
            */

            const deepAssessment =
                analyzeDeepAssessment(
                    answers,
                    uploads || {}
                );


            /*
            -------------------------------------------------
            Get the generated student profile
            -------------------------------------------------
            */

            const profile =
                deepAssessment.profile;


            if (!profile) {

                throw new Error(
                    "Deep assessment did not return a student profile"
                );

            }


            /*
            =================================================
            2. GET CALCULATED ASSESSMENT 2 READINESS
            =================================================

            IMPORTANT:

            We do NOT expect the frontend to send readiness.

            The readiness comes directly from:

            deepAssessment.assessment.revised_percentage
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
            3. PLAN THE STUDENT JOURNEY
            =================================================

            The planner receives the profile containing:

            profile.readiness = 84
            =================================================
            */

            const journeyPlan =
                planJourney(
                    profile,
                    scholarship
                );


            /*
            =================================================
            4. GENERATE PERSONALIZED VALLEYS AND TASKS
            =================================================
            */

            const journey =
                generateValleys(
                    profile.student_profile,
                    journeyPlan,
                    scholarship
                );


            /*
            =================================================
            5. EXPOSE ASSESSMENT 2 READINESS ON JOURNEY
            =================================================

            The journey uses exactly the same readiness
            calculated by Assessment 2.
            =================================================
            */

            journey.readiness =
                calculatedReadiness;


            /*
            -------------------------------------------------
            Also expose the Assessment 2 result.

            Frontend can use:

            journey.assessment.revised_percentage

            instead of recalculating it.
            -------------------------------------------------
            */

            journey.assessment =
                journey.assessment || {};


            journey.assessment.assessment_number =
                2;


            journey.assessment.revised_percentage =
                calculatedReadiness;


            /*
            =================================================
            6. SAVE JOURNEY
            =================================================
            */

            saveJourney(
                studentId,
                journey
            );


            /*
            =================================================
            7. RETURN NEWLY CREATED JOURNEY
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
=====================================================
GET JOURNEY

GET /api/journey/:studentId

Loads the student's saved journey.
=====================================================
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
=====================================================
SUBMIT TASK ANSWER

POST /api/journey/task/evaluate

Expected body:

{
    "studentId": "student-001",

    "taskId": "research-collect",

    "answer": "..."
}
=====================================================
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