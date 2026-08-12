const express = require("express");
const multer = require("multer");
const fs = require("fs");

const {
    evaluateTask
} = require("../services/taskEvaluationService");

const {
    updateJourneyProgress
} = require("../services/progressService");

const {
    extractDocumentText,
    validateDocumentType
} = require("../services/documentTaskService");

const {
    loadJourney,
    saveJourney
} = require("../services/journeyStore");

const router = express.Router();


/*
=================================================
UPLOAD STORAGE
=================================================
*/

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            const uploadDir =
                "uploads/journey-documents";


            if (
                !fs.existsSync(
                    uploadDir
                )
            ) {

                fs.mkdirSync(
                    uploadDir,
                    {
                        recursive: true
                    }
                );

            }


            cb(
                null,
                uploadDir
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
                file.originalname.replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );


            cb(
                null,
                filename
            );

        }

    });


const upload =
    multer({

        storage,

        limits: {

            fileSize:
                10 * 1024 * 1024

        }

    });


/*
=================================================
POST DOCUMENT FOR JOURNEY TASK

POST /api/journey/task/upload

Form-data:
- studentId
- taskId
- file
=================================================
*/

router.post(
    "/task/upload",
    upload.single("file"),
    async (req, res) => {

        try {

            const {
                studentId,
                taskId
            } = req.body;


            /*
            =============================================
            VALIDATE REQUEST
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


            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "file is required"

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
            FIND TASK
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


            /*
            =============================================
            CHECK FILE INPUT
            =============================================
            */

            if (
                task.input &&
                task.input.mode === "writing"
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "This task does not accept file uploads."

                });

            }


            /*
            =============================================
            OCR
            =============================================
            */

            console.log(
                "Processing journey document:",
                req.file.originalname
            );


            const extractedText =
                await extractDocumentText(
                    req.file
                );


            console.log(
                "Document text extracted."
            );


            /*
            =============================================
            VALIDATE DOCUMENT
            =============================================
            */

            const validation =
                validateDocumentType(
                    taskId,
                    extractedText
                );


            console.log(
                "Document validation result:",
                validation
            );


            /*
            =============================================
            WRONG DOCUMENT
            =============================================

            IMPORTANT:

            If a task previously had a valid document,
            uploading a wrong document must:

            - mark task incomplete
            - remove previous upload
            - remove previous document
            - recalculate progress
            - save journey
            =============================================
            */

            if (
                !validation.valid
            ) {

                console.log(
                    "Wrong document detected for task:",
                    taskId
                );


                /*
                ---------------------------------------------
                Mark task incomplete
                ---------------------------------------------
                */

                task.completed =
                    false;


                /*
                ---------------------------------------------
                Remove previous successful upload
                ---------------------------------------------
                */

                delete task.upload;


                /*
                Remove legacy document field too.
                Some older records may use "document".
                */

                delete task.document;


                /*
                ---------------------------------------------
                Get all OTHER completed tasks
                ---------------------------------------------
                */

                const completedTaskIds =
                    getCompletedTaskIds(
                        journey,
                        taskId
                    );


                /*
                ---------------------------------------------
                Recalculate journey progress
                ---------------------------------------------
                */

                const updatedJourney =
                    updateJourneyProgress(
                        journey,
                        completedTaskIds
                    );


                /*
                ---------------------------------------------
                Save corrected journey
                ---------------------------------------------
                */

                saveJourney(
                    studentId,
                    updatedJourney
                );


                /*
                ---------------------------------------------
                Find updated task
                ---------------------------------------------
                */

                const updatedTask =
                    findTask(
                        updatedJourney,
                        taskId
                    );


                console.log(
                    "Wrong document rejected. Task reset:",
                    {
                        taskId,
                        completed:
                            updatedTask.completed
                    }
                );


                /*
                ---------------------------------------------
                Return warning
                ---------------------------------------------
                */

                return res.status(422).json({

                    success: false,

                    completed:
                        updatedTask.completed,

                    warning: true,

                    message:
                        validation.message,

                    documentType:
                        validation.documentType,

                    task:
                        updatedTask,

                    journey:
                        updatedJourney

                });

            }


            /*
            =============================================
            ESSAY DOCUMENT
            =============================================

            Essays still need evaluation.

            The evaluator decides whether the task
            should become completed.
            =============================================
            */

            if (
                validation.documentType ===
                "essay"
            ) {

                const evaluation =
                    await evaluateTask({

                        task,

                        studentAnswer:
                            extractedText,

                        scholarship:
                            journey.scholarship

                    });


                console.log(
                    "Essay evaluation:",
                    evaluation
                );


                /*
                ---------------------------------------------
                EVALUATOR DECIDES COMPLETION
                ---------------------------------------------
                */

                if (
                    evaluation.canComplete === true
                ) {

                    task.completed =
                        true;

                }

                else {

                    task.completed =
                        false;

                }


                /*
                ---------------------------------------------
                STORE DOCUMENT
                ---------------------------------------------
                */

                task.document = {

                    filename:
                        req.file.originalname,

                    storedFilename:
                        req.file.filename,

                    documentType:
                        "essay",

                    uploadedAt:
                        new Date().toISOString()

                };


                /*
                ---------------------------------------------
                Get other completed tasks
                ---------------------------------------------
                */

                const completedTaskIds =
                    getCompletedTaskIds(
                        journey,
                        taskId
                    );


                /*
                ---------------------------------------------
                Add essay task only if evaluator
                approved completion
                ---------------------------------------------
                */

                if (
                    task.completed === true
                ) {

                    completedTaskIds.push(
                        taskId
                    );

                }


                /*
                ---------------------------------------------
                Recalculate journey progress
                ---------------------------------------------
                */

                const updatedJourney =
                    updateJourneyProgress(
                        journey,
                        completedTaskIds
                    );


                /*
                ---------------------------------------------
                Save updated journey
                ---------------------------------------------
                */

                saveJourney(
                    studentId,
                    updatedJourney
                );


                /*
                ---------------------------------------------
                Find updated task
                ---------------------------------------------
                */

                const updatedTask =
                    findTask(
                        updatedJourney,
                        taskId
                    );


                /*
                ---------------------------------------------
                Return
                ---------------------------------------------
                */

                return res.json({

                    success: true,

                    completed:
                        updatedTask.completed,

                    documentType:
                        "essay",

                    evaluation,

                    task:
                        updatedTask,

                    journey:
                        updatedJourney

                });

            }


            /*
            =============================================
            NORMAL DOCUMENT

            CV
            TRANSCRIPT
            RECOMMENDATION LETTER
            =============================================
            */

            task.completed =
                true;


            /*
            =============================================
            STORE UPLOAD INFORMATION
            =============================================
            */

            task.upload = {

                filename:
                    req.file.originalname,

                storedFilename:
                    req.file.filename,

                documentType:
                    validation.documentType,

                uploadedAt:
                    new Date().toISOString()

            };


            /*
            =============================================
            GET OTHER COMPLETED TASK IDS
            =============================================

            Exclude current task first so an old
            completion state cannot interfere.
            =============================================
            */

            const completedTaskIds =
                getCompletedTaskIds(
                    journey,
                    taskId
                );


            /*
            =============================================
            CURRENT DOCUMENT IS VALID
            =============================================
            */

            completedTaskIds.push(
                taskId
            );


            /*
            =============================================
            RECALCULATE CHECKPOINT + VALLEY PROGRESS
            =============================================

            Updates:

            - task.completed
            - checkpoint.progress
            - checkpoint.completed
            - valley.progress
            - valley.completed
            - valley.status
            =============================================
            */

            const updatedJourney =
                updateJourneyProgress(
                    journey,
                    completedTaskIds
                );


            /*
            =============================================
            SAVE UPDATED JOURNEY
            =============================================
            */

            saveJourney(
                studentId,
                updatedJourney
            );


            /*
            =============================================
            GET UPDATED TASK
            =============================================
            */

            const updatedTask =
                findTask(
                    updatedJourney,
                    taskId
                );


            /*
            =============================================
            RETURN SUCCESS
            =============================================
            */

            return res.json({

                success: true,

                completed:
                    updatedTask.completed,

                message:
                    validation.message,

                documentType:
                    validation.documentType,

                task:
                    updatedTask,

                journey:
                    updatedJourney

            });

        }


        catch (error) {

            console.error(
                "Journey document upload error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Document upload failed"

            });

        }

    }
);


/*
=================================================
FIND TASK
=================================================
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
=================================================
GET COMPLETED TASK IDS
=================================================
*/

function getCompletedTaskIds(
    journey,
    excludeTaskId = null
) {

    const completedTaskIds = [];


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

                /*
                ---------------------------------------------
                Exclude current task
                ---------------------------------------------
                */

                if (
                    task.id ===
                    excludeTaskId
                ) {

                    continue;

                }


                /*
                ---------------------------------------------
                Add completed tasks
                ---------------------------------------------
                */

                if (
                    task.completed === true
                ) {

                    completedTaskIds.push(
                        task.id
                    );

                }

            }

        }

    }


    return completedTaskIds;

}


/*
=================================================
EXPORT
=================================================
*/

module.exports = router;