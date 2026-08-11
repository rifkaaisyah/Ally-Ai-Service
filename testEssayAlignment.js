const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";
/*
 * Print the current journey status.
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
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}%`
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
    console.log("ESSAY ALIGNMENT TEST");
    console.log("======================================");


    /*
     * --------------------------------------------------
     * 1. LOAD EXISTING JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n1. Loading existing journey..."
    );

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


    /*
     * --------------------------------------------------
     * 2. SHOW CURRENT ESSAY VALLEY
     * --------------------------------------------------
     */

    console.log(
        "\n2. Current Essay Valley..."
    );

    const essayValley = journey.valleys?.find(
        valley => valley.id === "essay-valley"
    );

    if (!essayValley) {
        throw new Error(
            "Essay Valley not found"
        );
    }

    console.log(
        "Essay Valley:",
        {
            status: essayValley.status,
            progress: essayValley.progress,
            completed: essayValley.completed
        }
    );

    for (
        const checkpoint
        of essayValley.checkpoints || []
    ) {

        console.log(
            `\n${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
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


    /*
     * --------------------------------------------------
     * 3. FIND ESSAY ALIGNMENT TASK
     * --------------------------------------------------
     */

    console.log(
        "\n3. Finding Essay Alignment task..."
    );

    let selectedTask = null;

    for (
        const checkpoint
        of essayValley.checkpoints || []
    ) {

        for (
            const task
            of checkpoint.tasks || []
        ) {

            if (
                task.id === "essay-alignment"
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
            "Essay alignment task not found"
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


    /*
     * --------------------------------------------------
     * 4. SUBMIT ESSAY ALIGNMENT ANSWER
     * --------------------------------------------------
     */

    console.log(
        "\n4. Submitting Essay Alignment answer..."
    );

    const answer =
        "My academic and professional goals strongly align with the objectives of the Chevening Scholarship. " +
        "Through my Master's study, I want to strengthen my knowledge and leadership skills so I can apply them " +
        "to education and community development. My previous academic and research experiences have taught me " +
        "how to work with others, analyze problems, communicate findings, and take responsibility for projects. " +
        "Chevening is particularly relevant to my goals because it would allow me to develop international " +
        "perspectives, learn from a diverse network of professionals, and bring those experiences back to my community. " +
        "After completing the Master's degree, I plan to use the knowledge, leadership skills, and international " +
        "connections gained through the scholarship to contribute to meaningful projects in my field and create " +
        "long-term positive impact in my community.";

    const taskResponse = await axios.post(
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
     * 5. SHOW EVALUATION
     * --------------------------------------------------
     */

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
     * --------------------------------------------------
     * 6. SHOW UPDATED TASK
     * --------------------------------------------------
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
     * --------------------------------------------------
     * 7. SHOW UPDATED JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n5. Updated Essay Valley..."
    );

    const updatedJourney =
        taskResponse.data.journey;

    const updatedEssayValley =
        updatedJourney.valleys?.find(
            valley => valley.id === "essay-valley"
        );

    console.log(
        "Essay Valley:",
        {
            status: updatedEssayValley?.status,
            progress: updatedEssayValley?.progress,
            completed: updatedEssayValley?.completed
        }
    );

    for (
        const checkpoint
        of updatedEssayValley?.checkpoints || []
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


    /*
     * --------------------------------------------------
     * 8. CHECK APPLICATION VALLEY
     * --------------------------------------------------
     */

    console.log(
        "\n6. Application Valley..."
    );

    const applicationValley =
        updatedJourney.valleys?.find(
            valley =>
                valley.id === "application-valley"
        );

    console.log({
        status: applicationValley?.status,
        progress: applicationValley?.progress,
        completed: applicationValley?.completed
    });


    /*
     * --------------------------------------------------
     * 9. LOAD AGAIN TO VERIFY PERSISTENCE
     * --------------------------------------------------
     */

    console.log(
        "\n7. Loading journey again to verify persistence..."
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
                    task.id === "essay-alignment"
                ) {

                    persistedTask = task;

                }

            }

        }

    }


    console.log(
        "\nPersisted Essay Alignment task:"
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
     * 10. FINAL RESULT
     * --------------------------------------------------
     */

    console.log(
        "\n8. Final result..."
    );

    if (
        persistedTask &&
        persistedTask.completed === true
    ) {

        console.log(
            "SUCCESS: essay-alignment is completed and persisted."
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
        "\n======================================"
    );

    console.log(
        "TEST COMPLETE"
    );

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