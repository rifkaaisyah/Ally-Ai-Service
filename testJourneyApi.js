const axios = require("axios");


const BASE_URL =
    "http://localhost:3001";


/*
=========================================================
USE A NEW STUDENT ID

IMPORTANT:
If this student already has a saved journey,
the API will return the old journey instead of
creating a new one.

Use a new ID whenever testing journey creation.
=========================================================
*/

const studentId =
    "student-readiness-deep-84-api-test-002";


/*
=========================================================
SCHOLARSHIP
=========================================================
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
=========================================================
ASSESSMENT 2 ANSWERS
=========================================================

IMPORTANT:

There is NO readiness value here.

The backend must calculate Assessment 2 readiness
using:

answers
    ↓
deepAssessmentService
    ↓
deepProfileBuilder
    ↓
deepScoringEngine
    ↓
revised_percentage
    ↓
Journey
=========================================================
*/

const answers = {

    q2_master_motivation:
        "career_advancement",

    q3_master_plan_clarity:
        "exact_program_university",

    q4_academic_experience:
        [
            "research_experience"
        ],

    q5_academic_achievement_description:
        "I have completed academic projects and research activities.",

    q6_field_project_experience:
        "multiple_projects",

    q7_leadership_experience:
        [
            "student_organization",
            "research_project_leadership"
        ],

    q8_leadership_responsibility:
        "I coordinated a student research project and divided responsibilities among team members.",

    q9_leadership_impact:
        "measurable_result",

    q10_career_goal:
        "social_impact",

    q11_career_contribution_area:
        "education and community development",

    q12_target_countries:
        [
            "uk"
        ],

    q13_scholarship_type:
        "fully_funded",

    q14_scholarship_priority:
        [
            "funding",
            "university_reputation",
            "career"
        ],

    q15_cv_strength:
        "good_needs_improvement",

    q16_essay_readiness:
        "clear_story",

    q17_recommendation_availability:
        "available",

    q18_preparation_time:
        "more_than_10_hours",

    q19_application_deadline_target:
        "within_3_months",

    q20_support_needed:
        [
            "roadmap",
            "cv_help",
            "essay_help",
            "mentor"
        ]

};


/*
=========================================================
HELPER: PRINT JOURNEY
=========================================================
*/

function printJourney(journey) {

    console.log("\nJourney:");

    console.log(
        "Scholarship:",
        journey.scholarship?.name
    );


    console.log(
        "Readiness:",
        journey.readiness + "%"
    );


    console.log(
        "Strategy:",
        journey.strategy
    );


    if (journey.assessment) {

        console.log(
            "Assessment:",
            journey.assessment.assessment_number
        );


        console.log(
            "Assessment 2 Readiness:",
            journey.assessment.revised_percentage + "%"
        );

    }


    for (
        const valley
        of journey.valleys || []
    ) {

        console.log(
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}%`
        );


        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            console.log(
                `  ${checkpoint.title} | progress=${checkpoint.progress}%`
            );


            for (
                const task
                of checkpoint.tasks || []
            ) {

                console.log(
                    `    • ${task.id} | completed=${task.completed}`
                );

            }

        }

    }

}


/*
=========================================================
MAIN TEST
=========================================================
*/

async function run() {

    console.log(
        "======================================"
    );


    console.log(
        "REAL JOURNEY API FLOW TEST"
    );


    console.log(
        "======================================"
    );


    /*
    =====================================================
    1. CREATE JOURNEY
    =====================================================
    */

    console.log(
        "\n1. Creating journey..."
    );


    console.log(
        "Student ID:",
        studentId
    );


    console.log(
        "Assessment 2 readiness:",
        "CALCULATED BY BACKEND"
    );


    const createResponse =
        await axios.post(

            `${BASE_URL}/api/journey`,

            {

                studentId,

                answers,

                uploads: {},

                /*
                IMPORTANT:

                We intentionally DO NOT send:

                readiness: 67

                Assessment 2 is now responsible for
                calculating readiness.
                */

                scholarship

            }

        );


    console.log(
        "Create status:",
        createResponse.status
    );


    console.log(
        "Journey created:",
        createResponse.data.success
    );


    printJourney(
        createResponse.data.journey
    );


    /*
    =====================================================
    2. LOAD JOURNEY
    =====================================================
    */

    console.log(
        "\n2. Loading saved journey..."
    );


    const getResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );


    console.log(
        "GET status:",
        getResponse.status
    );


    console.log(
        "Journey loaded:",
        getResponse.data.success
    );


    /*
    =====================================================
    3. VERIFY READINESS
    =====================================================
    */

    const journey =
        getResponse.data.journey;


    console.log(
        "\n3. Verifying Assessment 2 → Journey readiness..."
    );


    console.log(
        "Journey readiness:",
        journey.readiness + "%"
    );


    if (journey.assessment) {

        console.log(
            "Assessment 2 readiness:",
            journey.assessment.revised_percentage + "%"
        );

    }


    if (
        journey.assessment &&
        journey.readiness ===
        journey.assessment.revised_percentage
    ) {

        console.log(
            "✓ Assessment 2 readiness successfully connected to Journey"
        );

    }

    else {

        console.log(
            "⚠ Assessment 2 readiness and Journey readiness do not match"
        );

    }


    /*
    =====================================================
    4. FIND A TASK DYNAMICALLY
    =====================================================
    */

    let selectedTask =
        null;


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
                    valley.status === "current" &&
                    !task.completed
                ) {

                    selectedTask =
                        task;

                    break;

                }

            }


            if (
                selectedTask
            ) {

                break;

            }

        }


        if (
            selectedTask
        ) {

            break;

        }

    }


    if (
        !selectedTask
    ) {

        throw new Error(
            "No available task found"
        );

    }


    console.log(
        "\n4. Dynamically selected task:"
    );


    console.log(
        "Task ID:",
        selectedTask.id
    );


    console.log(
        "Task:",
        selectedTask.title
    );


    /*
    =====================================================
    5. SUBMIT ANSWER
    =====================================================
    */

    console.log(
        "\n5. Submitting task answer..."
    );


    const taskResponse =
        await axios.post(

            `${BASE_URL}/api/journey/task/evaluate`,

            {

                studentId,

                taskId:
                    selectedTask.id,

                answer:
                    "I led a university research project with a team of 4 students. " +
                    "I coordinated the team, divided responsibilities, organized weekly meetings, " +
                    "managed the research timeline, and helped the team complete the project successfully. " +
                    "We completed the research and presented our findings to our academic supervisor."

            }

        );


    console.log(
        "Task evaluation status:",
        taskResponse.status
    );


    console.log(
        "\nEvaluation:"
    );


    console.log(
        JSON.stringify(

            taskResponse.data.evaluation,

            null,

            2

        )
    );


    /*
    =====================================================
    UPDATED TASK
    =====================================================
    */

    console.log(
        "\nUpdated task:"
    );


    console.log(
        JSON.stringify(

            taskResponse.data.task,

            null,

            2

        )
    );


    /*
    =====================================================
    6. SHOW UPDATED JOURNEY
    =====================================================
    */

    console.log(
        "\n6. Updated journey:"
    );


    printJourney(
        taskResponse.data.journey
    );


    /*
    =====================================================
    7. LOAD AGAIN
    =====================================================

    Verify that the task was actually persisted.
    =====================================================
    */

    console.log(
        "\n7. Loading journey again to verify persistence..."
    );


    const persistedResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );


    const persistedJourney =
        persistedResponse.data.journey;


    let persistedTask =
        null;


    for (
        const valley
        of persistedJourney.valleys || []
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
                    task.id ===
                    selectedTask.id
                ) {

                    persistedTask =
                        task;

                }

            }

        }

    }


    console.log(
        "\nPersisted task:"
    );


    console.log(
        JSON.stringify(

            persistedTask,

            null,

            2

        )
    );


    /*
    =====================================================
    FINAL RESULT
    =====================================================
    */

    console.log(
        "\n======================================"
    );


    console.log(
        "TEST COMPLETE"
    );


    console.log(
        "======================================"
    );

}


/*
=========================================================
ERROR HANDLING
=========================================================
*/

run()

    .catch(
        error => {

            console.error(
                "\nTEST FAILED"
            );


            if (
                error.response
            ) {

                console.error(
                    "Status:",
                    error.response.status
                );


                console.error(
                    "Response:",
                    error.response.data
                );

            }

            else {

                console.error(
                    error.message
                );

            }

        }
    );