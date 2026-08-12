const axios = require("axios");

/*
=========================================================
NEW STUDENT JOURNEY TEST
=========================================================

This test will:

1. Create a completely NEW student journey
2. Verify the journey was created
3. Check Essay Valley
4. Check essay-university
5. Check application-cv
6. Submit an essay answer
7. Check the AI evaluation
8. Check that essay-university becomes completed
9. Reload the journey
10. Verify persistence

IMPORTANT:
- This does NOT touch your existing student.
- Change STUDENT_ID if you want another fresh test.
=========================================================
*/

const BASE_URL = "http://localhost:3001";

const STUDENT_ID =
    "student-new-journey-test-001";


/*
=========================================================
HELPER: Find a task anywhere in the journey
=========================================================
*/

function findTask(journey, taskId) {

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
HELPER: Find a valley
=========================================================
*/

function findValley(
    journey,
    valleyId
) {

    return (
        journey.valleys || []
    ).find(
        valley =>
            valley.id === valleyId
    );

}


/*
=========================================================
HELPER: Print a valley
=========================================================
*/

function printValley(
    journey,
    valleyId
) {

    const valley =
        findValley(
            journey,
            valleyId
        );

    if (!valley) {

        console.log(
            `Valley not found: ${valleyId}`
        );

        return;

    }

    console.log(
        `\n${valley.title || valley.id}`
    );

    console.log({
        id:
            valley.id,

        status:
            valley.status,

        progress:
            valley.progress,

        completed:
            valley.completed
    });

    for (
        const checkpoint
        of valley.checkpoints || []
    ) {

        console.log(
            `\n  ${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
        );

        for (
            const task
            of checkpoint.tasks || []
        ) {

            console.log(
                `  • ${task.id} | ${task.title} | completed=${task.completed}`
            );

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
        "=========================================="
    );

    console.log(
        "NEW STUDENT JOURNEY TEST"
    );

    console.log(
        "=========================================="
    );

    console.log(
        "\nStudent ID:",
        STUDENT_ID
    );


    /*
    =====================================================
    1. CREATE NEW JOURNEY
    =====================================================
    */

    console.log(
        "\n1. Creating new journey..."
    );


    const createBody = {

        studentId:
            STUDENT_ID,

        answers: {

            academic: {

                study_direction:
                    "Computer Science"

            },

            career: {

                contribution_area:
                    "Technology"

            },

            leadership: {

                experience: [
                    "Led a university technology project"
                ]

            },

            nationality:
                "Indonesia"

        },

        uploads: {},

        scholarship: {

            id:
                "lpdp-001",

            name:
                "LPDP Scholarship",

            deadline:
                "2027-06-01"

        }

    };


    let createResponse;

    try {

        createResponse =
            await axios.post(

                `${BASE_URL}/api/journey`,

                createBody,

                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }

            );

    }
    catch (error) {

        console.error(
            "\nCREATE JOURNEY FAILED"
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

        return;

    }


    console.log(
        "POST status:",
        createResponse.status
    );


    console.log(
        "Journey created:",
        createResponse.data.success
    );


    console.log(
        "Existing:",
        createResponse.data.existing
    );


    if (
        createResponse.data.existing === true
    ) {

        console.log(
            "\nWARNING:"
        );

        console.log(
            "This student ID already has a journey."
        );

        console.log(
            "Change STUDENT_ID at the top of this file and run again."
        );

        return;

    }


    const journey =
        createResponse.data.journey;


    if (!journey) {

        throw new Error(
            "Journey was not returned."
        );

    }


    console.log(
        "\nSUCCESS: New journey created."
    );


    /*
    =====================================================
    2. PRINT JOURNEY VALLEYS
    =====================================================
    */

    console.log(
        "\n2. Checking generated valleys..."
    );


    console.log(
        "Number of valleys:",
        (journey.valleys || []).length
    );


    for (
        const valley
        of journey.valleys || []
    ) {

        console.log(
            `• ${valley.id} | status=${valley.status} | progress=${valley.progress}%`
        );

    }


    /*
    =====================================================
    3. CHECK ESSAY VALLEY
    =====================================================
    */

    console.log(
        "\n3. Checking Essay Valley..."
    );


    printValley(
        journey,
        "essay-valley"
    );


    /*
    =====================================================
    4. CHECK ESSAY UNIVERSITY
    =====================================================
    */

    console.log(
        "\n4. Checking essay-university..."
    );


    const essayTask =
        findTask(
            journey,
            "essay-university"
        );


    if (!essayTask) {

        throw new Error(
            "essay-university was not found."
        );

    }


    console.log(
        JSON.stringify(
            essayTask,
            null,
            2
        )
    );


    if (
        essayTask.completed === true
    ) {

        console.log(
            "\nWARNING: essay-university is already completed."
        );

    }
    else {

        console.log(
            "\nSUCCESS: essay-university starts incomplete."
        );

    }


    /*
    =====================================================
    5. CHECK APPLICATION CV
    =====================================================
    */

    console.log(
        "\n5. Checking application-cv..."
    );


    const cvTask =
        findTask(
            journey,
            "application-cv"
        );


    if (!cvTask) {

        console.log(
            "WARNING: application-cv was not found."
        );

    }
    else {

        console.log(
            JSON.stringify(
                cvTask,
                null,
                2
            )
        );

        console.log(
            "CV task completed:",
            cvTask.completed
        );

    }


    /*
    =====================================================
    6. SUBMIT UNIVERSITY ESSAY
    =====================================================
    */

    console.log(
        "\n6. Submitting university essay..."
    );


    const answer =
        "I want to study at a university that combines strong academic teaching with practical learning and research. The programme is relevant to my goal of developing stronger expertise in technology and using that knowledge to contribute to education and community development in Indonesia. I am particularly interested in learning from experienced academics, working with students from different backgrounds, and gaining exposure to new approaches that I can apply in my future career. The knowledge, network and experience from the programme would help me create meaningful impact in my field and community.";


    const evaluationBody = {

        studentId:
            STUDENT_ID,

        taskId:
            "essay-university",

        answer

    };


    let evaluationResponse;


    try {

        evaluationResponse =
            await axios.post(

                `${BASE_URL}/api/journey/task/evaluate`,

                evaluationBody,

                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }

            );

    }
    catch (error) {

        console.error(
            "\nTASK EVALUATION FAILED"
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

        return;

    }


    console.log(
        "Evaluation status:",
        evaluationResponse.status
    );


    /*
    =====================================================
    7. SHOW AI EVALUATION
    =====================================================
    */

    console.log(
        "\n7. AI Evaluation:"
    );


    console.log(
        JSON.stringify(
            evaluationResponse.data.evaluation,
            null,
            2
        )
    );


    /*
    =====================================================
    8. SHOW UPDATED TASK
    =====================================================
    */

    console.log(
        "\n8. Updated essay task:"
    );


    console.log(
        JSON.stringify(
            evaluationResponse.data.task,
            null,
            2
        )
    );


    /*
    =====================================================
    9. SHOW UPDATED ESSAY VALLEY
    =====================================================
    */

    console.log(
        "\n9. Updated Essay Valley:"
    );


    const updatedJourney =
        evaluationResponse.data.journey;


    printValley(
        updatedJourney,
        "essay-valley"
    );


    /*
    =====================================================
    10. RELOAD JOURNEY FROM SERVER
    =====================================================
    */

    console.log(
        "\n10. Reloading journey from server..."
    );


    const persistedResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${STUDENT_ID}`

        );


    console.log(
        "GET status:",
        persistedResponse.status
    );


    const persistedJourney =
        persistedResponse.data.journey;


    /*
    =====================================================
    11. VERIFY ESSAY PERSISTENCE
    =====================================================
    */

    console.log(
        "\n11. Checking persisted essay task..."
    );


    const persistedEssayTask =
        findTask(
            persistedJourney,
            "essay-university"
        );


    console.log(
        JSON.stringify(
            persistedEssayTask,
            null,
            2
        )
    );


    /*
    =====================================================
    12. VERIFY CV STILL EXISTS
    =====================================================
    */

    console.log(
        "\n12. Checking persisted CV task..."
    );


    const persistedCVTask =
        findTask(
            persistedJourney,
            "application-cv"
        );


    if (
        persistedCVTask
    ) {

        console.log(
            JSON.stringify(
                persistedCVTask,
                null,
                2
            )
        );

    }


    /*
    =====================================================
    13. FINAL RESULT
    =====================================================
    */

    console.log(
        "\n=========================================="
    );

    console.log(
        "FINAL TEST RESULT"
    );

    console.log(
        "=========================================="
    );


    if (
        persistedEssayTask &&
        persistedEssayTask.completed === true
    ) {

        console.log(
            "SUCCESS"
        );

        console.log(
            "New journey created."
        );

        console.log(
            "Essay was evaluated."
        );

        console.log(
            "essay-university was completed."
        );

        console.log(
            "Completion persisted after reload."
        );

    }
    else {

        console.log(
            "FAILED"
        );

        console.log(
            "essay-university was not persisted as completed."
        );

    }


    console.log(
        "\nStudent:",
        STUDENT_ID
    );

    console.log(
        "=========================================="
    );

}


/*
=========================================================
RUN
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