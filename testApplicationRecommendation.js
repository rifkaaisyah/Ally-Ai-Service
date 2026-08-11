const axios = require("axios");

const BASE_URL = "http://localhost:3001";
const studentId = "student-leadership-flow-001";

/*
 * APPLICATION RECOMMENDATION TEST
 *
 * This test continues the existing scholarship journey.
 *
 * Leadership Valley and Essay Valley are already completed.
 * application-cv and application-transcript are already completed.
 *
 * We will:
 * 1. Load the existing journey
 * 2. Confirm Application Valley is current
 * 3. Find application-recommendation
 * 4. Submit a strong answer
 * 5. Check AI evaluation
 * 6. Check task completion
 * 7. Check Application Valley progress
 * 8. Verify previous valleys remain completed
 * 9. Verify persistence
 */

async function run() {
    console.log("======================================");
    console.log("APPLICATION RECOMMENDATION TEST");
    console.log("======================================");

    /*
     * --------------------------------------------------
     * 1. LOAD EXISTING JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n1. Loading existing journey..."
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

    const journey =
        getResponse.data.journey;

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
        status:
            applicationValley.status,

        progress:
            applicationValley.progress,

        completed:
            applicationValley.completed
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
     * 3. FIND APPLICATION RECOMMENDATION TASK
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
                task.id ===
                "application-recommendation"
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
            "application-recommendation task was not found"
        );
    }

    console.log(
        "\n3. Finding Application Recommendation task..."
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
     * 4. SUBMIT RECOMMENDATION ANSWER
     * --------------------------------------------------
     *
     * The answer demonstrates preparation for:
     *
     * - selecting appropriate referees
     * - confirming their suitability
     * - providing relevant information
     * - giving them enough context
     * - ensuring submission requirements are met
     */

    const answer =
        "I would identify referees who can provide strong and relevant evidence of my academic, professional, and leadership abilities. Ideally, they would be people who have directly supervised my academic work, research, professional responsibilities, or leadership activities and can provide specific examples of my strengths and potential. Before listing them in the application, I would ask for their permission, confirm that they are available during the application period, and make sure I have their correct contact details and professional information. I would also provide them with my CV, scholarship goals, programme information, and key achievements so they can write a focused and accurate recommendation. I would check the scholarship requirements carefully to ensure the recommendations are submitted in the required format and by the relevant deadline.";

    /*
     * --------------------------------------------------
     * 5. SUBMIT ANSWER
     * --------------------------------------------------
     */

    console.log(
        "\n4. Submitting Application Recommendation answer..."
    );

    const taskResponse =
        await axios.post(
            `${BASE_URL}/api/journey/task/evaluate`,
            {
                studentId,
                taskId:
                    selectedTask.id,
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
                valley.id ===
                "application-valley"
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
                valley.id ===
                "leadership-valley"
        );

    const essayValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id ===
                "essay-valley"
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
        "\nPersisted Application Recommendation:"
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
            "SUCCESS: application-recommendation is completed and persisted."
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