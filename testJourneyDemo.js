const {
    planJourney
} = require("./services/journeyPlanner");

const {
    generateValleys
} = require("./services/valleyGenerator");

const {
    saveJourney,
    loadJourney
} = require("./services/journeyStore");


/*
 * TEMPORARY TEST STUDENT
 *
 * This simulates the profile that will
 * eventually come from Assessment 2.
 */

const testProfile = {

    student_profile: {

        academic: {

            master_motivation:
                "I want to pursue a Master's degree to build advanced skills.",

            study_plan_clarity:
                "Very Clear",

            academic_experiences: [
                "research_experience"
            ],

            academic_achievement:
                "Completed undergraduate academic projects.",

            field_project_experience:
                "multiple"

        },


        leadership: {

            experience: [
                "Student organization leadership"
            ],

            impact:
                "Led a team of 10 students."

        },


        career: {

            goal:
                "Become an education technology specialist.",

            contribution_area:
                "Improve higher education through technology."

        },


        application_readiness: {

            cv_strength:
                "good_needs_improvement",

            essay_readiness:
                "needs_structure",

            recommendation_status:
                true

        }

    }

};


/*
 * TEMPORARY SCHOLARSHIP SELECTION
 *
 * This simulates the student clicking
 * "Chevening" in the future FE popup.
 */

const scholarship = {

    id:
        "chevening-001",

    name:
        "Chevening Scholarship",

    deadline: {

        application_period:
            "2026-11-04"

    }

};


/*
 * Temporary student ID.
 */

const studentId =
    "demo-student-001";


async function run() {

    console.log(
        "\n=============================="
    );

    console.log(
        "TEMPORARY JOURNEY DEMO"
    );

    console.log(
        "==============================\n"
    );


    /*
     * 1. Create journey plan.
     */

    console.log(
        "Creating journey plan..."
    );

    const journeyPlan =
        planJourney(
            testProfile,
            scholarship
        );


    console.log(
        "\nJourney Plan:"
    );

    console.log(
        JSON.stringify(
            journeyPlan,
            null,
            2
        )
    );


    /*
     * 2. Generate personalized valleys.
     */

    console.log(
        "\nGenerating valleys..."
    );

    const journey =
        generateValleys(

            testProfile.student_profile,

            journeyPlan,

            scholarship

        );


    /*
     * 3. Save journey.
     */

    console.log(
        "\nSaving journey..."
    );

    saveJourney(
        studentId,
        journey
    );


    /*
     * 4. Load it again.
     */

    console.log(
        "Loading saved journey..."
    );

    const savedJourney =
        loadJourney(
            studentId
        );


    /*
     * 5. Print the frontend-friendly
     *    roadmap structure.
     */

    console.log(
        "\n=============================="
    );

    console.log(
        "ROADMAP FOR FRONTEND"
    );

    console.log(
        "==============================\n"
    );


    console.log(
        JSON.stringify(
            savedJourney,
            null,
            2
        )
    );


    /*
     * 6. Print a simple summary.
     */

    console.log(
        "\n=============================="
    );

    console.log(
        "VALLEY SUMMARY"
    );

    console.log(
        "==============================\n"
    );


    for (
        const valley
        of savedJourney.valleys || []
    ) {

        console.log(
            `${valley.order}. ${valley.name || valley.title || valley.id}`
        );

        console.log(
            `   status: ${valley.status}`
        );

        console.log(
            `   progress: ${valley.progress}%`
        );


        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            console.log(
                `   - ${checkpoint.name || checkpoint.title || checkpoint.id}`
            );

            for (
                const task
                of checkpoint.tasks || []
            ) {

                console.log(
                    `      • ${task.title || task.name || task.id} | completed=${task.completed}`
                );

            }

        }

    }


    console.log(
        "\nTemporary journey test complete."
    );

}


run().catch(error => {

    console.error(
        "\nJourney demo failed:"
    );

    console.error(
        error
    );

});