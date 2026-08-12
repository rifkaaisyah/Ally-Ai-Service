const {
    getValleyTemplate
} = require("./valleyTemplates");

/**
 * Generate a gamified scholarship journey
 * from the journey planner result.
 *
 * This version does not use an LLM.
 * It creates deterministic frontend-ready JSON.
 *
 * IMPORTANT:
 * - Keeps existing valley/task structure.
 * - Does not change existing task IDs.
 * - Does not change existing completion state.
 * - Adds safe input metadata for future file/text submission.
 */
function generateValleys(
    studentProfile,
    journeyPlan,
    scholarship
) {

    if (!journeyPlan) {
        throw new Error(
            "Journey plan is required"
        );
    }

    const valleys = [];

    /*
    =================================================
    RESEARCH VALLEY
    =================================================
    */

    if (
        studentProfile?.academic?.academic_experiences
            ?.includes("research_experience")
    ) {

        const researchValley =
            cloneTemplate("research");

        if (researchValley) {

            valleys.push(
                researchValley
            );

        }

    }

    /*
    =================================================
    LEADERSHIP VALLEY
    =================================================
    */

    if (
        studentProfile?.leadership
    ) {

        const leadershipValley =
            cloneTemplate("leadership");

        if (leadershipValley) {

            valleys.push(
                leadershipValley
            );

        }

    }

    /*
    =================================================
    ESSAY VALLEY
    =================================================

    Essays are useful for almost every
    major scholarship application.
    */

    const essayValley =
        cloneTemplate("essay");

    if (essayValley) {

        valleys.push(
            essayValley
        );

    }

    /*
    =================================================
    APPLICATION VALLEY
    =================================================
    */

    const applicationValley =
        cloneTemplate("application");

    if (applicationValley) {

        valleys.push(
            applicationValley
        );

    }

    /*
    =================================================
    BUILD FINAL JOURNEY
    =================================================
    */

    return {

        scholarship: {

            id:
                scholarship?.id ||
                null,

            name:
                scholarship?.name ||
                scholarship?.metadata?.name ||
                null,

            deadline:
                scholarship?.deadline ||
                null

        },

        strategy:
            journeyPlan.strategy ||
            "current_cycle",

        feasibility:
            journeyPlan.feasibility ||
            null,

        urgency:
            journeyPlan.urgency ||
            null,

        readiness:
            journeyPlan.readiness ??
            null,

        valleys:
            valleys.map(
                (valley, index) => {

                    /*
                    -----------------------------------------
                    Determine initial valley status
                    -----------------------------------------
                    */

                    const valleyStatus =
                        index === 0
                            ? "current"
                            : "locked";


                    /*
                    -----------------------------------------
                    Prepare checkpoints
                    -----------------------------------------
                    */

                    const checkpoints =
                        Array.isArray(
                            valley.checkpoints
                        )
                            ? valley.checkpoints
                            : [];


                    return {

                        ...valley,

                        order:
                            index + 1,

                        status:
                            valleyStatus,

                        progress:
                            0,

                        completed:
                            false,

                        checkpoints:
                            checkpoints.map(
                                checkpoint => {

                                    const tasks =
                                        Array.isArray(
                                            checkpoint.tasks
                                        )
                                            ? checkpoint.tasks
                                            : [];


                                    return {

                                        ...checkpoint,

                                        progress:
                                            0,

                                        completed:
                                            false,

                                        tasks:
                                            tasks.map(
                                                task => {

                                                    /*
                                                    ---------------------------------
                                                    Keep the original task unchanged
                                                    and only add safe metadata.
                                                    ---------------------------------
                                                    */

                                                    return {
                                                        ...task,

                                                        completed:
                                                            false,

                                                        input:
                                                            getTaskInputConfig(
                                                                task,
                                                                valley
                                                                    .id
                                                            )

                                                    };

                                                }
                                            )

                                    };

                                }
                            )

                    };

                }
            )

    };

}


/**
 * Determine how a task can receive
 * the student's work.
 *
 * This does NOT process files.
 *
 * It only tells the frontend/backend
 * what kind of submission the task accepts.
 */
function getTaskInputConfig(
    task,
    valleyId
) {

    /*
    =================================================
    ESSAY TASKS
    =================================================

    Writing tasks can accept:
    - typed text
    - uploaded document
    */

    if (
        valleyId === "essay-valley" ||
        task?.type === "writing"
    ) {

        return {

            mode: "text_or_file",

            accepted_inputs: [
                "text",
                "file"
            ],

            accepted_file_types: [
                "pdf",
                "doc",
                "docx",
                "txt"
            ]

        };

    }


    /*
    =================================================
    APPLICATION DOCUMENT TASKS
    =================================================

    Document tasks are primarily file uploads.
    */

    if (
        valleyId === "application-valley" &&
        task?.type === "document"
    ) {

        return {

            mode: "file",

            accepted_inputs: [
                "file"
            ],

            accepted_file_types: [
                "pdf",
                "doc",
                "docx",
                "txt",
                "jpg",
                "jpeg",
                "png"
            ]

        };

    }


    /*
    =================================================
    DEFAULT
    =================================================

    Existing tasks continue behaving like
    normal text tasks.
    */

    return {

        mode: "text",

        accepted_inputs: [
            "text"
        ],

        accepted_file_types: []

    };

}


/**
 * Create a fresh copy of a template.
 *
 * This is important because we don't want
 * one student's completed tasks to modify
 * the original template.
 */
function cloneTemplate(type) {

    const template =
        getValleyTemplate(type);

    if (!template) {

        return null;

    }

    /*
    Safely clone the template.
    */

    return JSON.parse(
        JSON.stringify(
            template
        )
    );

}


module.exports = {

    generateValleys

};