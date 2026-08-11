const axios = require("axios");

const BASE_URL = "http://localhost:3001";
const studentId = "student-leadership-flow-001";

/*
 * APPLICATION TRANSCRIPT TEST
 *
 * This test continues the existing scholarship journey.
 *
 * Leadership Valley and Essay Valley have already
 * been completed.
 *
 * We will:
 * 1. Load the existing journey
 * 2. Confirm Application Valley is current
 * 3. Find application-transcript
 * 4. Submit a strong answer
 * 5. Check AI evaluation
 * 6. Check task completion
 * 7. Check Application Valley progress
 * 8. Verify previous valleys remain completed
 * 9. Verify persistence
 */

function printJourney(journey) {
    console.log("\n--- JOURNEY STATUS ---");

    console.log(
        "Scholarship:",
        journey.scholarship?.name
    );

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    for (const valley of journey.valleys || []) {
        console.log(
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}% | completed=${valley.completed}`
        );

        for (const checkpoint of valley.checkpoints || []) {
            console.log(
                `${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
            );

            for (const task of checkpoint.tasks || []) {
                console.log(
                    `• ${task.id} | completed=${task.completed}`
                );
            }
        }
    }
}

async function run() {
    console.log("======================================");
    console.log("APPLICATION TRANSCRIPT TEST");
    console.log("======================================");

    /*
     * --------------------------------------------------
     * 1. LOAD EXISTING JOURNEY
     * --------------------------------------------------
     */

    console.log("\n1. Loading existing journey...");

    const getResponse = await axios.get(
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

    const journey = getResponse.data.journey;

    printJourney(journey);

    /*
     * --------------------------------------------------
     * 2. CHECK APPLICATION VALLEY
     * --------------------------------------------------
     */

    const applicationValley =
        journey.valleys.find(
            valley =>
                valley.id === "application-valley"
        );

    if (!applicationValley) {
        throw new Error(
            "Application Valley was not found"
        );
    }

    console.log(
        "\n2. Current Application Valley..."
    );

    console.log({
        status: applicationValley.status,
        progress: applicationValley.progress,
        completed: applicationValley.completed
    });

    if (
        applicationValley.status !== "current"
    ) {
        throw new Error(
            `Application Valley is not current. Current status: ${applicationValley.status}`
        );
    }

    /*
     * --------------------------------------------------
     * 3. FIND APPLICATION TRANSCRIPT TASK
     * --------------------------------------------------
     */

    let selectedTask = null;

    for (
        const checkpoint
        of applicationValley.checkpoints || []
    ) {
        for (
            const task
            of checkpoint.tasks || []
        ) {
            if (
                task.id === "application-transcript"
            ) {
                selectedTask = task;
                break;
            }
        }

        if (selectedTask) {
            break;
        }
    }

    if (!selectedTask) {
        throw new Error(
            "application-transcript task was not found"
        );
    }

    console.log(
        "\n3. Finding Application Transcript task..."
    );

    console.log(
        "Task ID:",
        selectedTask.id
    );

    console.log(
        "Task:",
        selectedTask.title
    );

    console.log(
        "Description:",
        selectedTask.description
    );

    console.log(
        "Completed:",
        selectedTask.completed
    );

    /*
     * --------------------------------------------------
     * 4. SUBMIT TRANSCRIPT ANSWER
     * --------------------------------------------------
     *
     * The answer demonstrates that the student:
     *
     * - has checked transcript requirements
     * - has organized academic records
     * - has verified accuracy
     * - understands supporting documentation
     * - is preparing documents for scholarship submission
     */

    const answer =
        "I have reviewed my academic transcript and checked that it accurately reflects my academic history, including my degree, courses, grades, and overall academic record. I would make sure the transcript is complete, clearly readable, and consistent with the information provided in my application and CV. I would also confirm that the document meets the scholarship requirements for formatting, language, certification, and submission. Before submitting the application, I would verify that all academic information is accurate and that any required official or certified version of the transcript is available. This preparation will help ensure that my academic background is presented clearly and professionally to the scholarship selection committee.";

    /*
     * --------------------------------------------------
     * 5. SUBMIT APPLICATION TRANSCRIPT ANSWER
     * --------------------------------------------------
     */

    console.log(
        "\n4. Submitting Application Transcript answer..."
    );

    const taskResponse =
        await axios.post(
            `${BASE_URL}/api/journey/task/evaluate`,
            {
                studentId,
                taskId: selectedTask.id,
                answer
            }
        );

    console.log(
        "Task evaluation status:",
        taskResponse.status
    );

    /*
     * --------------------------------------------------
     * 6. SHOW EVALUATION
     * --------------------------------------------------
     */

    console.log(
        "\n5. Evaluation..."
    );

    console.log(
        JSON.stringify(
            taskResponse.data.evaluation,
            null,
            2
        )
    );

    /*
     * --------------------------------------------------
     * 7. SHOW UPDATED TASK
     * --------------------------------------------------
     */

    console.log(
        "\n6. Updated task..."
    );

    console.log(
        JSON.stringify(
            taskResponse.data.task,
            null,
            2
        )
    );

    /*
     * --------------------------------------------------
     * 8. SHOW UPDATED APPLICATION VALLEY
     * --------------------------------------------------
     */

    const updatedJourney =
        taskResponse.data.journey;

    const updatedApplicationValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "application-valley"
        );

    console.log(
        "\n7. Updated Application Valley..."
    );

    console.log({
        status:
            updatedApplicationValley.status,

        progress:
            updatedApplicationValley.progress,

        completed:
            updatedApplicationValley.completed
    });

    /*
     * --------------------------------------------------
     * 9. VERIFY PREVIOUS VALLEYS
     * --------------------------------------------------
     */

    const leadershipValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "leadership-valley"
        );

    const essayValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "essay-valley"
        );

    console.log(
        "\n8. Verify previous valleys..."
    );

    console.log(
        "Leadership Valley:",
        {
            status:
                leadershipValley.status,

            progress:
                leadershipValley.progress,

            completed:
                leadershipValley.completed
        }
    );

    console.log(
        "Essay Valley:",
        {
            status:
                essayValley.status,

            progress:
                essayValley.progress,

            completed:
                essayValley.completed
        }
    );

    /*
     * --------------------------------------------------
     * 10. VERIFY PERSISTENCE
     * --------------------------------------------------
     */

    console.log(
        "\n9. Loading journey again to verify persistence..."
    );

    const persistedResponse =
        await axios.get(
            `${BASE_URL}/api/journey/${studentId}`
        );

    console.log(
        "GET status:",
        persistedResponse.status
    );

    const persistedJourney =
        persistedResponse.data.journey;

    let persistedTask = null;

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
                    persistedTask = task;
                }
            }
        }
    }

    console.log(
        "\nPersisted Application Transcript:"
    );

    console.log(
        JSON.stringify(
            persistedTask,
            null,
            2
        )
    );

    /*
     * --------------------------------------------------
     * FINAL RESULT
     * --------------------------------------------------
     */

    console.log(
        "\n======================================"
    );

    if (
        taskResponse.data.task?.completed === true &&
        persistedTask?.completed === true
    ) {
        console.log(
            "SUCCESS: application-transcript is completed and persisted."
        );
    } else {
        console.log(
            "TASK NOT COMPLETED."
        );

        console.log(
            "Use the AI evaluation feedback above to improve the answer and retry."
        );
    }

    console.log(
        "======================================"
    );
}

run()
    .catch(error => {
        console.error(
            "\nTEST FAILED"
        );

        if (error.response) {
            console.error(
                "Status:",
                error.response.status
            );

            console.error(
                "Response:",
                error.response.data
            );
        } else {
            console.error(
                error.message
            );
        }
    });