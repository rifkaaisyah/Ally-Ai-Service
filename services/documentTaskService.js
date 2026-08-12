
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

const convertPDFToImages =
    require("../utils/pdfToImages");

const {
    updateJourneyProgress
} = require("./progressService");


/*
=================================================
EXTRACT TEXT FROM DOCUMENT
=================================================
*/

async function extractDocumentText(file) {

    if (!file) {
        throw new Error("File is required");
    }


    /*
    =================================================
    TXT
    =================================================
    */

    if (
        file.mimetype === "text/plain" ||
        path.extname(file.originalname).toLowerCase() === ".txt"
    ) {

        return fs.readFileSync(
            file.path,
            "utf8"
        ).trim();

    }


    let images = [];


    /*
    =================================================
    PDF
    =================================================
    */

    if (
        file.mimetype === "application/pdf"
    ) {

        images =
            await convertPDFToImages(
                file.path
            );

    }


    /*
    =================================================
    IMAGES
    =================================================
    */

    else if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    ) {

        images.push(
            file.path
        );

    }


    /*
    =================================================
    UNSUPPORTED FILE
    =================================================
    */

    else {

        throw new Error(
            "This file type cannot currently be processed. Please upload PDF, JPG, JPEG, PNG, or TXT."
        );

    }


    let extractedText = "";


    /*
    =================================================
    OCR
    =================================================
    */

    for (
        const image of images
    ) {

        console.log(
            "OCR reading:",
            image
        );


        const result =
            await Tesseract.recognize(
                image,
                "eng",
                {

                    logger: info => {

                        if (
                            info.status ===
                            "recognizing text"
                        ) {

                            console.log(
                                Math.round(
                                    info.progress * 100
                                ) + "%"
                            );

                        }

                    }

                }
            );


        extractedText +=
            result.data.text +
            "\n\n";

    }


    /*
    =================================================
    OCR RESULT
    =================================================
    */

    console.log(
        "================ OCR TEXT ================"
    );

    console.log(
        extractedText
    );

    console.log(
        "=========================================="
    );


    return extractedText.trim();

}


/*
=================================================
VALIDATE DOCUMENT TYPE
=================================================
*/

function validateDocumentType(
    taskId,
    text
) {

    const normalized =
        String(text || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();


    console.log(
        "Document validation:",
        {
            taskId,
            textLength: normalized.length
        }
    );


    /*
    =================================================
    ESSAY TASK
    =================================================
    */

    if (
        taskId.startsWith("essay-")
    ) {

        if (
            normalized.length < 50
        ) {

            return {

                valid: false,

                documentType:
                    "unknown",

                message:
                    "We could not extract enough text from this essay file. Please upload a clearer document."

            };

        }


        return {

            valid: true,

            documentType:
                "essay",

            message:
                "Essay document detected successfully."

        };

    }


    /*
    =================================================
    CV TASK
    =================================================
    */

    if (
        taskId ===
        "application-cv"
    ) {

        const cvKeywords = [

            "curriculum vitae",
            "curriculum",
            "resume",
            "professional experience",
            "work experience",
            "education",
            "skills",
            "experience",
            "employment",
            "profile",
            "objective",
            "professional summary",
            "career objective",
            "work history"

        ];


        const birthCertificateKeywords = [

            "birth certificate",
            "certificate of birth",
            "date of birth",
            "place of birth",
            "mother",
            "father"

        ];


        const cvMatches =
            cvKeywords.filter(
                keyword =>
                    normalized.includes(
                        keyword
                    )
            ).length;


        const birthMatches =
            birthCertificateKeywords.filter(
                keyword =>
                    normalized.includes(
                        keyword
                    )
            ).length;


        /*
        -------------------------------------------------
        Birth certificate
        -------------------------------------------------
        */

        if (
            birthMatches >= 2 &&
            cvMatches < 2
        ) {

            return {

                valid: false,

                documentType:
                    "birth_certificate",

                message:
                    "This does not appear to be a CV. It looks like a birth certificate. Please upload your CV."

            };

        }


        /*
        -------------------------------------------------
        CV
        -------------------------------------------------
        */

        if (
            cvMatches >= 2
        ) {

            return {

                valid: true,

                documentType:
                    "cv",

                message:
                    "CV document detected successfully."

            };

        }


        return {

            valid: false,

            documentType:
                "unknown",

            message:
                "We could not confirm that this is a CV. Please upload a clear CV or resume."

        };

    }


    /*
    =================================================
    TRANSCRIPT TASK
    =================================================
    */

    if (
        taskId ===
        "application-transcript"
    ) {

        const transcriptKeywords = [

            "transcript",
            "academic transcript",
            "student transcript",
            "academic record",
            "academic records",
            "course",
            "courses",
            "semester",
            "grade",
            "grades",
            "gpa",
            "credits",
            "credit",
            "university",
            "college",
            "academic year",
            "student id",
            "student number",
            "study program",
            "study programme",
            "faculty",
            "department",
            "cumulative",
            "index"

        ];


        const transcriptMatches =
            transcriptKeywords.filter(
                keyword =>
                    normalized.includes(
                        keyword
                    )
            ).length;


        if (
            transcriptMatches >= 2
        ) {

            return {

                valid: true,

                documentType:
                    "transcript",

                message:
                    "Academic transcript detected successfully."

            };

        }


        return {

            valid: false,

            documentType:
                "unknown",

            message:
                "We could not confirm that this is an academic transcript. Please upload a clear transcript or academic record."

        };

    }


    /*
    =================================================
    RECOMMENDATION LETTER TASK
    =================================================
    */

    if (
        taskId ===
        "application-recommendation"
    ) {

        /*
        -------------------------------------------------
        Strong recommendation-letter indicators
        -------------------------------------------------
        */

        const strongRecommendationKeywords = [

            "letter of recommendation",
            "recommendation letter",
            "letter of reference",
            "reference letter",
            "academic reference",
            "professional reference",
            "to whom it may concern",
            "i am pleased to recommend",
            "i am writing to recommend",
            "i am happy to recommend",
            "i strongly recommend",
            "i highly recommend",
            "i recommend"

        ];


        /*
        -------------------------------------------------
        Supporting recommendation-letter indicators
        -------------------------------------------------
        */

        const supportingRecommendationKeywords = [

            "applicant",
            "referee",
            "referee's",
            "supervisor",
            "professor",
            "lecturer",
            "dear admissions",
            "dear selection committee",
            "selection committee",
            "admissions committee",
            "best regards",
            "kind regards",
            "yours sincerely",
            "yours faithfully"

        ];


        /*
        -------------------------------------------------
        CV indicators
        -------------------------------------------------
        */

        const cvKeywords = [

            "curriculum vitae",
            "curriculum",
            "resume",
            "professional experience",
            "work experience",
            "education",
            "skills",
            "employment",
            "work history",
            "professional summary",
            "career objective",
            "projects",
            "certifications"

        ];


        const strongMatches =
            strongRecommendationKeywords.filter(
                keyword =>
                    normalized.includes(
                        keyword
                    )
            );


        const supportingMatches =
            supportingRecommendationKeywords.filter(
                keyword =>
                    normalized.includes(
                        keyword
                    )
            );


        const cvMatches =
            cvKeywords.filter(
                keyword =>
                    normalized.includes(
                        keyword
                    )
            );


        console.log(
            "Recommendation validation:",
            {
                strongMatches,
                supportingMatches,
                cvMatches
            }
        );


        /*
        -------------------------------------------------
        Reject obvious CV
        -------------------------------------------------
        */

        if (
            cvMatches.length >= 3 &&
            strongMatches.length === 0
        ) {

            return {

                valid: false,

                documentType:
                    "cv",

                message:
                    "This document appears to be a CV or resume, not a recommendation letter. Please upload a recommendation or reference letter."

            };

        }


        /*
        -------------------------------------------------
        Valid recommendation letter
        -------------------------------------------------

        Require either:

        1. One strong recommendation phrase
           + one supporting indicator

        OR

        2. Two strong recommendation phrases
        -------------------------------------------------
        */

        const validRecommendation =
            (
                strongMatches.length >= 1 &&
                supportingMatches.length >= 1
            ) ||
            (
                strongMatches.length >= 2
            );


        if (
            validRecommendation
        ) {

            return {

                valid: true,

                documentType:
                    "recommendation",

                message:
                    "Recommendation letter detected successfully."

            };

        }


        /*
        -------------------------------------------------
        Reject document
        -------------------------------------------------
        */

        return {

            valid: false,

            documentType:
                "unknown",

            message:
                "We could not confirm that this is a recommendation letter. Please upload a clear recommendation or reference letter."

        };

    }


    /*
    =================================================
    UNKNOWN TASK
    =================================================
    */

    return {

        valid: false,

        documentType:
            "unknown",

        message:
            "This document task does not have a document validation rule yet."

    };

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
        const valley of journey.valleys || []
    ) {

        for (
            const checkpoint of valley.checkpoints || []
        ) {

            for (
                const task of checkpoint.tasks || []
            ) {

                if (
                    task.id ===
                    excludeTaskId
                ) {

                    continue;

                }


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
PROCESS DOCUMENT TASK
=================================================
*/

async function processDocumentTask({

    journey,
    taskId,
    file

}) {

    if (!journey) {

        throw new Error(
            "Journey is required"
        );

    }


    if (!taskId) {

        throw new Error(
            "Task ID is required"
        );

    }


    if (!file) {

        throw new Error(
            "File is required"
        );

    }


    /*
    =================================================
    FIND TASK
    =================================================
    */

    let targetTask = null;


    for (
        const valley of journey.valleys || []
    ) {

        for (
            const checkpoint of valley.checkpoints || []
        ) {

            for (
                const task of checkpoint.tasks || []
            ) {

                if (
                    task.id ===
                    taskId
                ) {

                    targetTask =
                        task;

                }

            }

        }

    }


    if (!targetTask) {

        throw new Error(
            `Task not found: ${taskId}`
        );

    }


    /*
    =================================================
    EXTRACT TEXT
    =================================================
    */

    const extractedText =
        await extractDocumentText(
            file
        );


    /*
    =================================================
    VALIDATE DOCUMENT
    =================================================
    */

    const validation =
        validateDocumentType(
            taskId,
            extractedText
        );


    /*
    =================================================
    GET OTHER COMPLETED TASKS
    =================================================
    */

    const completedTaskIds =
        getCompletedTaskIds(
            journey,
            taskId
        );


    /*
    =================================================
    DOCUMENT ACCEPTED
    =================================================
    */

    if (
        validation.valid
    ) {

        completedTaskIds.push(
            taskId
        );


        targetTask.completed =
            true;


        targetTask.upload = {

            filename:
                file.originalname,

            storedFilename:
                file.filename,

            documentType:
                validation.documentType,

            uploadedAt:
                new Date().toISOString()

        };

    }


    /*
    =================================================
    DOCUMENT REJECTED
    =================================================
    */

    else {

        targetTask.completed =
            false;


        /*
        IMPORTANT:
        Remove previous successful upload.

        This prevents a previously accepted document
        from remaining attached to the task after
        a wrong document is uploaded.
        */

        delete targetTask.upload;

    }


    /*
    =================================================
    RECALCULATE PROGRESS
    =================================================
    */

    const updatedJourney =
        updateJourneyProgress(
            journey,
            completedTaskIds
        );


    /*
    =================================================
    FIND UPDATED TASK
    =================================================
    */

    const updatedTask =
        updatedJourney.valleys
            .flatMap(
                valley =>
                    valley.checkpoints || []
            )
            .flatMap(
                checkpoint =>
                    checkpoint.tasks || []
            )
            .find(
                task =>
                    task.id === taskId
            );


    /*
    =================================================
    RETURN
    =================================================
    */

    return {

        journey:
            updatedJourney,

        task:
            updatedTask,

        validation,

        extractedText

    };

}


/*
=================================================
EXPORT
=================================================
*/

module.exports = {

    extractDocumentText,

    validateDocumentType,

    getCompletedTaskIds,

    processDocumentTask

};
