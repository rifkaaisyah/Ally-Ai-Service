const express = require("express");
const multer = require("multer");

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

const {
    extractTextFromFile
} = require("../services/ocrService");

const {
    validateDocument
} = require("../services/documentValidationService");


/*
=========================================================
UPLOAD CONFIGURATION
=========================================================
*/

const uploadStorage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                "uploads/"
            );

        },

        filename: (
            req,
            file,
            cb
        ) => {

            const filename =
                Date.now() +
                "-" +
                file.originalname;

            cb(
                null,
                filename
            );

        }

    });


const journeyUpload =
    multer({
        storage: uploadStorage
    });


/*
=========================================================
CREATE JOURNEY

POST /api/journey
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
            =============================================
            1. VALIDATE STUDENT ID
            =============================================
            */

            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "studentId is required"

                });

            }


            /*
            =============================================
            2. VALIDATE ANSWERS
            =============================================
            */

            if (!answers) {

                return res.status(400).json({

                    success: false,

                    error:
                        "answers are required"

                });

            }


            /*
            =============================================
            3. VALIDATE SCHOLARSHIP
            =============================================
            */

            if (!scholarship) {

                return res.status(400).json({

                    success: false,

                    error:
                        "scholarship is required"

                });

            }


            /*
            =============================================
            4. CHECK EXISTING JOURNEY
            =============================================
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
            =============================================
            5. RUN ASSESSMENT 2
            =============================================
            */

            console.log(
                "Running Assessment 2 for journey:",
                studentId
            );


            const deepAssessment =
                await analyzeDeepAssessment(
                    answers,
                    uploads || {}
                );


            if (!deepAssessment) {

                throw new Error(
                    "Deep assessment returned no result"
                );

            }


            /*
            =============================================
            6. GET PROFILE
            =============================================
            */

            const profile =
                deepAssessment.profile;


            if (
                !profile ||
                !profile.student_profile
            ) {

                console.error(
                    "Invalid Assessment 2 profile:",
                    JSON.stringify(
                        deepAssessment,
                        null,
                        2
                    )
                );

                throw new Error(
                    "Deep assessment did not return a valid student profile"
                );

            }


            console.log(
                "Student profile successfully generated."
            );


            /*
            =============================================
            7. GET READINESS
            =============================================
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


            console.log(
                "Assessment 2 readiness:",
                calculatedReadiness
            );


            /*
            =============================================
            8. PUT READINESS INTO PROFILE
            =============================================
            */

            profile.readiness =
                calculatedReadiness;


            /*
            =============================================
            9. PLAN JOURNEY
            =============================================
            */

            console.log(
                "Planning journey..."
            );


            const journeyPlan =
                planJourney(
                    profile,
                    scholarship
                );


            /*
            =============================================
            10. GENERATE VALLEYS
            =============================================
            */

            console.log(
                "Generating journey valleys..."
            );


            let journey =
                generateValleys(
                    profile.student_profile,
                    journeyPlan,
                    scholarship
                );


            /*
            =============================================
            11. ADD READINESS
            =============================================
            */

            journey.readiness =
                calculatedReadiness;


            /*
            =============================================
            12. ADD ASSESSMENT
            =============================================
            */

            journey.assessment =
                journey.assessment || {};


            journey.assessment
                .assessment_number =
                    2;


            journey.assessment
                .revised_percentage =
                    calculatedReadiness;


            /*
            =============================================
            13. PLAN TIMELINE
            =============================================
            */

            console.log(
                "Planning timeline..."
            );


            journey =
                planTimeline(
                    journey
                );


            /*
            =============================================
            14. MAKE SURE READINESS SURVIVES
            =============================================
            */

            journey.readiness =
                calculatedReadiness;


            journey.assessment =
                journey.assessment || {};


            journey.assessment
                .assessment_number =
                    2;


            journey.assessment
                .revised_percentage =
                    calculatedReadiness;


            /*
            =============================================
            15. SAVE
            =============================================
            */

            console.log(
                "Saving journey:",
                studentId
            );


            saveJourney(
                studentId,
                journey
            );


            /*
            =============================================
            16. RETURN
            =============================================
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
SUBMIT TEXT TASK ANSWER

POST /api/journey/task/evaluate
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
            =============================================
            VALIDATION
            =============================================
            */

            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "studentId is required"

                });

            }


            if (!taskId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "taskId is required"

                });

            }


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
            =============================================
            LOAD JOURNEY
            =============================================
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
            =============================================
            EVALUATE
            =============================================
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
            =============================================
            SAVE
            =============================================
            */

            saveJourney(
                studentId,
                result.journey
            );


            /*
            =============================================
            RETURN
            =============================================
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


/*
=========================================================
UPLOAD + OCR + DOCUMENT CHECK + EVALUATION

POST /api/journey/task/evaluate-upload

multipart/form-data

studentId
taskId
file
=========================================================
*/

router.post(
    "/task/evaluate-upload",
    journeyUpload.single("file"),
    async (req, res) => {

        try {

            const {
                studentId,
                taskId
            } = req.body;


            /*
            =============================================
            1. VALIDATE STUDENT ID
            =============================================
            */

            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "studentId is required"

                });

            }


            /*
            =============================================
            2. VALIDATE TASK ID
            =============================================
            */

            if (!taskId) {

                return res.status(400).json({

                    success: false,

                    error:
                        "taskId is required"

                });

            }


            /*
            =============================================
            3. VALIDATE FILE
            =============================================
            */

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "file is required"

                });

            }


            console.log(
                "Uploaded file:",
                req.file.originalname
            );


            /*
            =============================================
            4. LOAD JOURNEY
            =============================================
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
            =============================================
            5. FIND TASK
            =============================================
            */

            const task =
                findTask(
                    journey,
                    taskId
                );


            if (!task) {

                return res.status(404).json({

                    success: false,

                    error:
                        `Task not found: ${taskId}`

                });

            }


            console.log(
                "Upload task:",
                task.title
            );


            /*
            =============================================
            6. OCR
            =============================================
            */

            console.log(
                "Starting OCR..."
            );


            const extractedText =
                await extractTextFromFile(
                    req.file
                );


            if (
                !extractedText ||
                !extractedText.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    status:
                        "needs_improvement",

                    message:
                        "We could not read the uploaded document. Please upload a clearer file."

                });

            }


            console.log(
                "OCR completed."
            );


            /*
            =============================================
            7. DOCUMENT TYPE CHECK
            =============================================
            */

            let documentCheck = null;


            /*
            Only perform document checking
            when the task actually expects
            a specific document.
            */

            if (
                task.expected_document_type
            ) {

                console.log(
                    "Checking document type..."
                );


                documentCheck =
                    await validateDocument({

                        task,

                        extractedText

                    });


                console.log(
                    "Document check:",
                    documentCheck
                );


                /*
                =========================================
                WRONG DOCUMENT
                =========================================
                */

                if (
                    documentCheck.valid !== true
                ) {

                    return res.json({

                        success: true,

                        status:
                            "wrong_document",

                        document: {

                            valid: false,

                            uploaded_type:
                                documentCheck.document_type,

                            expected_type:
                                task.expected_document_type,

                            confidence:
                                documentCheck.confidence

                        },

                        warning:
                            `This task requires a ${task.expected_document_type}, but the uploaded document appears to be a ${documentCheck.document_type}. Please upload the correct document.`,

                        task: {

                            id:
                                task.id,

                            completed:
                                task.completed

                        }

                    });

                }

            }


            /*
            =============================================
            8. CORRECT DOCUMENT
            =============================================
            */

            console.log(
                "Document accepted."
            );


            /*
            OCR text becomes the answer.
            We reuse the EXISTING task
            evaluation system.
            */

            const result =
                await submitTaskAnswer({

                    journey,

                    taskId,

                    studentAnswer:
                        extractedText,

                    scholarship:
                        journey.scholarship

                });


            /*
            =============================================
            9. SAVE UPDATED JOURNEY
            =============================================
            */

            saveJourney(
                studentId,
                result.journey
            );


            /*
            =============================================
            10. RETURN RESULT
            =============================================
            */

            return res.json({

                success: true,

                status:
                    result.evaluation.status,

                document: {

                    valid: true,

                    type:
                        documentCheck
                            ? documentCheck.document_type
                            : "document",

                    confidence:
                        documentCheck
                            ? documentCheck.confidence
                            : null

                },

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
                "Journey upload evaluation error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Failed to process uploaded document"

            });

        }

    }
);


/*
=========================================================
FIND TASK HELPER
=========================================================
*/

function findTask(
    journey,
    taskId
) {

    for (
        const valley
        of journey.valleys || []
    ) {

        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            for (
                const task
                of checkpoint.tasks || []
            ) {

                if (
                    task.id === taskId
                ) {

                    return task;

                }

            }

        }

    }


    return null;
}


/*
=========================================================
EXPORT
=========================================================
*/

module.exports = router;