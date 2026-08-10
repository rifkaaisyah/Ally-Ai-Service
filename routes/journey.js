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
=========================================================
CREATE JOURNEY
=========================================================

POST /api/journey

Expected body:

{
    "studentId": "student-001",

    "answers": {
        ...
    },

    "uploads": {},

    "readiness": 67,

    "scholarship": {
        "id": "chevening-001",
        "name": "Chevening Scholarship"
    }
}

Flow:

Assessment 2
    ↓
readiness
    ↓
deep assessment profile
    ↓
journey planner
    ↓
valley generator
    ↓
save journey
*/


router.post(
    "/",
    async (req, res) => {

        try {

            const {
                studentId,
                answers,
                uploads,
                scholarship,
                readiness
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
            -------------------------------------------------
            1. Analyze Assessment 2 answers
            -------------------------------------------------
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


            /*
            -------------------------------------------------
            Assessment 2 readiness
           
            In the real system:

            FE
              ↓
            BE
              ↓
            Assessment 2 result
              ↓
            Ally AI

            For now, our test script sends:

            readiness: 67

            We place that value into the profile so the
            Journey Planner can use it.
            -------------------------------------------------
            */

            if (
                readiness !== undefined &&
                readiness !== null
            ) {

                const numericReadiness =
                    Number(readiness);


                if (
                    !Number.isNaN(
                        numericReadiness
                    )
                ) {

                    profile.readiness =
                        numericReadiness;

                }

            }


            /*
            -------------------------------------------------
            2. Plan the student's journey
            -------------------------------------------------
            */

            const journeyPlan =
                planJourney(
                    profile,
                    scholarship
                );


            /*
            -------------------------------------------------
            3. Generate personalized valleys and tasks
            -------------------------------------------------
            */

            const journey =
                generateValleys(
                    profile.student_profile,
                    journeyPlan,
                    scholarship
                );


            /*
            -------------------------------------------------
            Make sure the journey exposes the same readiness
            value that was used by the planner.
            -------------------------------------------------
            */

            if (
                readiness !== undefined &&
                readiness !== null
            ) {

                const numericReadiness =
                    Number(readiness);


                if (
                    !Number.isNaN(
                        numericReadiness
                    )
                ) {

                    journey.readiness =
                        numericReadiness;

                }

            }


            /*
            -------------------------------------------------
            4. Save journey
            -------------------------------------------------
            */

            saveJourney(
                studentId,
                journey
            );


            /*
            -------------------------------------------------
            5. Return newly-created journey
            -------------------------------------------------
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
=========================================================

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
=========================================================

POST /api/journey/task/evaluate

Expected body:

{
    "studentId": "student-001",

    "taskId": "research-collect",

    "answer": "..."
}

The student's saved journey is loaded.
The task is found dynamically.
The answer is evaluated.
Progress is updated.
The updated journey is saved.
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
            Evaluate answer against the student's journey
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