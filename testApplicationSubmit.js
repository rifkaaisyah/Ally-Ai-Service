const axios = require("axios");

const BASE_URL = "http://localhost:3001";
const studentId = "student-leadership-flow-001";

/*
 * APPLICATION SUBMIT TEST
 *
 * This is the final task in the scholarship journey.
 *
 * Leadership Valley = completed
 * Essay Valley = completed
 * Application Valley = current
 *
 * We will:
 * 1. Load the existing journey
 * 2. Confirm Application Valley is current
 * 3. Find application-submit
 * 4. Submit a strong final-submission answer
 * 5. Check AI evaluation
 * 6. Check task completion
 * 7. Check Application Valley progress
 * 8. Verify all previous valleys remain completed
 * 9. Verify the complete journey becomes completed
 * 10. Verify persistence
 */

function printJourneyStatus(journey) {

    console.log("\n--- JOURNEY STATUS ---");

    console.log(
        "Scholarship:",
        journey.scholarship?.name
    );

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    for (
        const valley
        of journey.valleys || []
    ) {

        console.log(
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}% | completed=${valley.completed}`
        );

        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            console.log(
                `${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
            );

            for (
                const task
                of checkpoint.tasks || []
            ) {

                console.log(
                    `• ${task.id} | completed=${task.completed}`
                );

            }

        }

    }

}


async function run() {

    console.log(
        "\n# APPLICATION SUBMIT TEST"
    );


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

    printJourneyStatus(
        journey
    );


    /*
     * --------------------------------------------------
     * 2. CHECK APPLICATION VALLEY
     * --------------------------------------------------
     */

    console.log(
        "\n2. Current Application Valley..."
    );

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
     * 3. FIND APPLICATION SUBMIT TASK
     * --------------------------------------------------
     */

    console.log(
        "\n3. Finding Application Submit task..."
    );

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
                task.id === "application-submit"
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
            "Application Submit task was not found"
        );

    }


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


    if (
        selectedTask.completed
    ) {

        throw new Error(
            "application-submit is already completed"
        );

    }


    /*
     * --------------------------------------------------
     * 4. SUBMIT FINAL APPLICATION ANSWER
     * --------------------------------------------------
     *
     * The answer demonstrates that the student
     * understands the final submission process:
     *
     * - final requirements check
     * - document verification
     * - proofreading
     * - consistency
     * - file formats
     * - deadlines
     * - final review
     */

    const answer =
        "Before submitting my scholarship application, I would complete a final verification of every requirement and make sure all required documents and essays are included in the correct format. I would confirm that my CV, academic records, recommendation letters, and written responses are complete and consistent with one another. I would also review my essays against the scholarship criteria to ensure that my leadership experience, career goals, motivation, and expected impact are clearly demonstrated. After completing the final proofreading check, I would verify file names, formatting, readability, and any required supporting information. I would then submit the application before the deadline and keep confirmation of submission for my records. This final review would ensure that the application accurately represents my academic background, leadership experience, professional goals, and motivation for the scholarship."


    /*
     * --------------------------------------------------
     * 5. SUBMIT APPLICATION
     * --------------------------------------------------
     */

    console.log(
        "\n4. Submitting final application answer..."
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
     * 9. VERIFY ALL VALLEYS
     * --------------------------------------------------
     */

    console.log(
        "\n8. Verify all valleys..."
    );

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


    console.log(
        "Application Valley:",
        {
            status:
                updatedApplicationValley.status,

            progress:
                updatedApplicationValley.progress,

            completed:
                updatedApplicationValley.completed
        }
    );


    /*
     * --------------------------------------------------
     * 10. VERIFY PREVIOUS VALLEYS WERE NOT CHANGED
     * --------------------------------------------------
     */

    if (
        leadershipValley.completed !== true ||
        leadershipValley.progress !== 100 ||
        leadershipValley.status !== "completed"
    ) {

        throw new Error(
            "Leadership Valley should remain completed"
        );

    }


    if (
        essayValley.completed !== true ||
        essayValley.progress !== 100 ||
        essayValley.status !== "completed"
    ) {

        throw new Error(
            "Essay Valley should remain completed"
        );

    }


    /*
     * --------------------------------------------------
     * 11. VERIFY APPLICATION VALLEY COMPLETION
     * --------------------------------------------------
     */

    if (
        updatedApplicationValley.completed !== true
    ) {

        console.log(
            "\nApplication Valley is not completed yet."
        );

    }
    else {

        console.log(
            "\nApplication Valley is COMPLETED."
        );

    }


    /*
     * --------------------------------------------------
     * 12. SHOW COMPLETE JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n9. Final journey status..."
    );

    printJourneyStatus(
        updatedJourney
    );


    /*
     * --------------------------------------------------
     * 13. VERIFY PERSISTENCE
     * --------------------------------------------------
     */

    console.log(
        "\n10. Loading journey again to verify persistence..."
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
                    task.id === "application-submit"
                ) {

                    persistedTask = task;

                }

            }

        }

    }


    console.log(
        "\nPersisted Application Submit:"
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
     * 14. FINAL RESULT
     * --------------------------------------------------
     */

    const persistedApplicationValley =
        persistedJourney.valleys.find(
            valley =>
                valley.id === "application-valley"
        );


    if (
        taskResponse.data.task.completed === true &&
        persistedTask &&
        persistedTask.completed === true &&
        persistedApplicationValley &&
        persistedApplicationValley.completed === true &&
        persistedApplicationValley.progress === 100
    ) {

        console.log(
            "\n======================================"
        );

        console.log(
            "🎉 SUCCESS: APPLICATION VALLEY COMPLETED"
        );

        console.log(
            "======================================"
        );

        console.log(
            "\nThe complete scholarship journey has been completed and persisted."
        );

    }
    else {

        console.log(
            "\nTASK NOT COMPLETED."
        );

        console.log(
            "Use the AI evaluation feedback above to improve the answer and retry."
        );

    }

}


run()
.catch(error => {

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

});