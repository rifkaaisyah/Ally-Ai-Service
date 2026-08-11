const axios = require("axios");


const BASE_URL =
    "http://localhost:3001";


/*
=========================================================
USE A NEW STUDENT ID
=========================================================

Important:

We use a new ID so an old saved journey with readiness=0
doesn't get returned.
=========================================================
*/

const studentId =
    "student-readiness-67-api-test-001";

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
SIMULATED ASSESSMENT 2 RESULT
=========================================================

In the real platform:

FE
 ↓
BE
 ↓
Assessment 2
 ↓
67% readiness
 ↓
Ally AI
 ↓
Journey

For this temporary test we simulate the Assessment 2
result directly.
=========================================================
*/

const assessment2Readiness =
    67;


/*
=========================================================
ASSESSMENT 2 ANSWERS
=========================================================
*/

const answers = {

    q1_why_do_you_want_to_pursue_this_masters_degree:
        "I want to pursue a Master's degree to develop my expertise and create meaningful impact.",

    q2_master_motivation:
        "I want to strengthen my academic and professional skills.",

    q3_master_plan_clarity:
        "Very Clear",

    q4_academic_experience:
        "research experience",

    q5_academic_achievement_description:
        "I have completed academic projects and research activities.",

    q6_field_project_experience:
        "multiple projects",

    q7_leadership_experience:
        "I have participated in student organizations and led projects.",

    q8_leadership_responsibility:
        "I coordinated a student project.",

    q9_leadership_impact:
        "The project involved multiple students and produced useful outcomes.",

    q10_career_goal:
        "I want to build a career in my field and contribute to my community.",

    q11_career_contribution_area:
        "education and community development",

    q12_target_countries:
        "United Kingdom",

    q13_scholarship_type:
        "fully funded",

    q14_scholarship_priority:
        "High",

    q15_cv_strength:
        "Good",

    q16_essay_readiness:
        "Draft Ready",

    q17_recommendation_availability:
        "Available",

    q18_preparation_time:
        "More than 1 year",

    q19_application_deadline_target:
        "2026"

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
        "Simulated Assessment 2 readiness:",
        assessment2Readiness + "%"
    );


    const createResponse =
        await axios.post(

            `${BASE_URL}/api/journey`,

            {

                studentId,

                answers,

                uploads: {},

                /*
                -----------------------------------------
                This is the important part.
                -----------------------------------------
                */

                readiness:
                    assessment2Readiness,

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
    3. FIND A TASK DYNAMICALLY
    =====================================================
    */

    const journey =
        getResponse.data.journey;


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
        "\n3. Dynamically selected task:"
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
    4. SUBMIT ANSWER
    =====================================================
    */

    console.log(
        "\n4. Submitting task answer..."
    );


    /*
    This answer is intentionally stronger than the
    previous test.

    It gives the AI an actual leadership example.
    */

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
    5. SHOW UPDATED JOURNEY
    =====================================================
    */

    console.log(
        "\n5. Updated journey:"
    );


    printJourney(
        taskResponse.data.journey
    );


    /*
    =====================================================
    6. LOAD AGAIN
    =====================================================
    
    This verifies that the journey was actually saved.
    =====================================================
    */

    console.log(
        "\n6. Loading journey again to verify persistence..."
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