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


async function main() {

    console.log("");
    console.log("==============================");
    console.log("REALISTIC JOURNEY FLOW TEST");
    console.log("==============================");
    console.log("");


    /*
     * STEP 1
     *
     * Simulate the result that comes
     * from Assessment 2.
     *
     * Your real Assessment 2 recently
     * returned revised_percentage = 67.
     */

    const assessment2Result = {

        assessment: {

            revised_percentage: 67,

            suggestion:
                "Based on your deep assessment, you have a clear career direction, academic experience and leadership experience."

        }

    };


    console.log(
        "Assessment 2 readiness:",
        assessment2Result
            .assessment
            .revised_percentage + "%"
    );


    /*
     * STEP 2
     *
     * Simulate the student profile
     * produced from Assessment 2.
     *
     * This is temporary until the
     * real backend sends the profile.
     */

    const studentProfile = {

        readiness_percentage:
            assessment2Result
                .assessment
                .revised_percentage,


        academic: {

            master_motivation:
                "I want to pursue a Master's degree to develop my expertise.",

            study_plan_clarity:
                "Very Clear",

            academic_experiences: [

                "research_experience",

                "field_project"

            ],

            academic_achievement:
                "Completed academic projects"

        },


        leadership: {

            experience: [

                "student organization",

                "community project"

            ],

            impact:
                "Led a project involving 20 students"

        },


        career: {

            goal:
                "Become an education technology professional",

            contribution_area:
                "Improve access to higher education"

        },


        application_readiness: {

            cv_strength:
                "Good",

            essay_readiness:
                "needs_structure",

            recommendation_status:
                false

        }

    };


    /*
     * STEP 3
     *
     * Simulate scholarship recommendations
     * from the previous AI/RAG flow.
     *
     * Pretend the FE popup showed the
     * student several scholarships.
     */

    const recommendedScholarships = [

        {
            id: "chevening-001",

            name:
                "Chevening Scholarship"
        },

        {
            id: "commonwealth-001",

            name:
                "Commonwealth Scholarship"
        }

    ];


    console.log("");
    console.log("Scholarship recommendations:");

    recommendedScholarships.forEach(
        (scholarship, index) => {

            console.log(
                `${index + 1}. ${scholarship.name}`
            );

        }
    );


    /*
     * STEP 4
     *
     * TEMPORARY SCHOLARSHIP SELECTION
     *
     * This simulates the student
     * clicking:
     *
     * "Continue with Chevening"
     *
     * in the future FE popup.
     */

    const selectedScholarship =
        recommendedScholarships[0];


    console.log("");
    console.log(
        "Student selected:",
        selectedScholarship.name
    );


    /*
     * STEP 5
     *
     * Add the information required
     * by the journey planner.
     *
     * This is a temporary Chevening
     * scholarship object.
     */

    const scholarship = {

        id:
            selectedScholarship.id,

        name:
            selectedScholarship.name,


        deadline: {

            application_period:
                "2026-11-04"

        }

    };


    /*
     * STEP 6
     *
     * Plan the student's journey.
     */

    console.log("");
    console.log(
        "Creating journey plan..."
    );


    const journeyPlan =
        planJourney(
            studentProfile,
            scholarship
        );


    console.log("");
    console.log(
        "Journey Plan:"
    );

    console.log(
        JSON.stringify(
            journeyPlan,
            null,
            2
        )
    );


    /*
     * STEP 7
     *
     * Generate personalized valleys.
     */

    console.log("");
    console.log(
        "Generating valleys..."
    );


    const journey =
        generateValleys(

            studentProfile,

            journeyPlan,

            scholarship

        );


    /*
     * STEP 8
     *
     * Save the same way the real
     * API saves a student's journey.
     */

    const studentId =
        "student-demo-001";


    console.log("");
    console.log(
        "Saving journey for:",
        studentId
    );


    saveJourney(
        studentId,
        journey
    );


    /*
     * STEP 9
     *
     * Load it again.
     *
     * This proves that the journey
     * survives after generation.
     */

    console.log("");
    console.log(
        "Loading saved journey..."
    );


    const savedJourney =
        loadJourney(
            studentId
        );


    /*
     * STEP 10
     *
     * Print the information that
     * the frontend actually needs.
     */

    console.log("");
    console.log(
        "=============================="
    );

    console.log(
        "FRONTEND ROADMAP DATA"
    );

    console.log(
        "=============================="
    );


    console.log("");

    console.log(
        "Scholarship:",
        savedJourney
            .scholarship
            .name
    );

    console.log(
        "Readiness:",
        savedJourney
            .readiness + "%"
    );

    console.log(
        "Strategy:",
        savedJourney
            .strategy
    );

    console.log("");


    savedJourney.valleys.forEach(
        (valley) => {

            console.log(
                `${valley.order}. ${valley.name}`
            );

            console.log(
                `   status=${valley.status}`
            );

            console.log(
                `   progress=${valley.progress}%`
            );


            valley.checkpoints.forEach(
                (checkpoint) => {

                    console.log(
                        `   - ${checkpoint.title}`
                    );


                    checkpoint.tasks.forEach(
                        (task) => {

                            console.log(
                                `      • ${task.title} | id=${task.id} | completed=${task.completed}`
                            );

                        }
                    );

                }
            );


            console.log("");

        }
    );


    console.log(
        "=============================="
    );

    console.log(
        "REALISTIC JOURNEY TEST COMPLETE"
    );

    console.log(
        "=============================="
    );

}


main().catch(
    (error) => {

        console.error(
            "Test failed:",
            error
        );

        process.exit(1);

    }
);