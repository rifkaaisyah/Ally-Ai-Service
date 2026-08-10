const {
    getValleyTemplate
} = require("./valleyTemplates");


/**
 * Generate a gamified scholarship journey
 * from the journey planner result.
 *
 * This version does not use an LLM.
 * It creates deterministic frontend-ready JSON.
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
     * Research Valley
     */

    if (
        studentProfile?.academic?.academic_experiences
            ?.includes("research_experience")
    ) {

        const researchValley =
            cloneTemplate(
                "research"
            );

        if (researchValley) {

            valleys.push(
                researchValley
            );

        }

    }


    /*
     * Leadership Valley
     */

    if (
        studentProfile?.leadership
    ) {

        const leadershipValley =
            cloneTemplate(
                "leadership"
            );

        if (leadershipValley) {

            valleys.push(
                leadershipValley
            );

        }

    }


    /*
     * Essay Valley
     *
     * Essays are useful for almost every
     * major scholarship application.
     */

    const essayValley =
        cloneTemplate(
            "essay"
        );

    if (essayValley) {

        valleys.push(
            essayValley
        );

    }


    /*
     * Application Valley
     */

    const applicationValley =
        cloneTemplate(
            "application"
        );

    if (applicationValley) {

        valleys.push(
            applicationValley
        );

    }


    /*
     * Add journey metadata
     */

    return {

        scholarship: {

            id:
                scholarship?.id || null,

            name:
                scholarship?.name ||
                scholarship?.metadata?.name ||
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
                (valley, index) => ({

                    ...valley,

                    order:
                        index + 1,

                    status:
                        index === 0
                            ? "current"
                            : "locked",

                    progress:
                        0,

                    completed:
                        false

                })
            )

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
        getValleyTemplate(
            type
        );


    if (!template) {

        return null;

    }


    return JSON.parse(
        JSON.stringify(
            template
        )
    );

}


module.exports = {
    generateValleys
};