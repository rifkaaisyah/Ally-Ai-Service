const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

async function run() {
    console.log("\n# ESSAY CLARITY TEST\n");

    /*
     * 1. Load existing journey
     */

    console.log("1. Loading existing journey...");

    const response = await axios.get(
        `${BASE_URL}/api/journey/${studentId}`
    );

    console.log(
        "GET status:",
        response.status
    );

    const journey = response.data.journey;

    console.log(
        "Journey loaded:",
        response.data.success
    );

    /*
     * 2. Find Essay Valley
     */

    const essayValley = journey.valleys.find(
        valley => valley.id === "essay-valley"
    );

    if (!essayValley) {
        throw new Error("Essay Valley not found");
    }

    console.log("\n2. Current Essay Valley...");

    console.log({
        status: essayValley.status,
        progress: essayValley.progress,
        completed: essayValley.completed
    });

    for (
        const checkpoint
        of essayValley.checkpoints || []
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
     * 3. Find essay-clarity dynamically
     */

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
                task.id === "essay-clarity"
            ) {
                selectedTask = task;
                break;
            }
        }

        if (selectedTask) break;
    }

    if (!selectedTask) {
        throw new Error(
            "essay-clarity task not found"
        );
    }

    console.log(
        "\n3. Finding Essay Clarity task..."
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
     * 4. Submit clarity answer
     *
     * The answer demonstrates:
     * - clear structure
     * - concise writing
     * - logical flow
     * - specific examples
     */

    console.log(
        "\n4. Submitting Essay Clarity answer..."
    );

    const taskResponse = await axios.post(
        `${BASE_URL}/api/journey/task/evaluate`,
        {
            studentId,
            taskId: selectedTask.id,
            answer:
                "My goal is to use advanced research and leadership skills to improve education in my community. During my university research project, I led a team of 5 students, coordinated our work, and analyzed 200 survey responses. We completed the project 2 weeks ahead of schedule and used the findings to improve our final recommendations. This experience showed me how structured collaboration and evidence-based decisions can create measurable results. Through a Master's degree, I want to strengthen these skills and apply them to larger education and community development challenges."
        }
    );

    console.log(
        "Task evaluation status:",
        taskResponse.status
    );

    console.log("\nEvaluation:");

    console.log(
        JSON.stringify(
            taskResponse.data.evaluation,
            null,
            2
        )
    );

    /*
     * 5. Show updated task
     */

    console.log("\nUpdated task:");

    console.log(
        JSON.stringify(
            taskResponse.data.task,
            null,
            2
        )
    );

    /*
     * 6. Show updated Essay Valley
     */

    const updatedJourney =
        taskResponse.data.journey;

    const updatedEssayValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "essay-valley"
        );

    console.log(
        "\n5. Updated Essay Valley..."
    );

    console.log({
        status: updatedEssayValley.status,
        progress: updatedEssayValley.progress,
        completed: updatedEssayValley.completed
    });

    for (
        const checkpoint
        of updatedEssayValley.checkpoints || []
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
     * 7. Check Application Valley
     */

    const applicationValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "application-valley"
        );

    console.log(
        "\n6. Application Valley..."
    );

    console.log({
        status: applicationValley.status,
        progress: applicationValley.progress,
        completed: applicationValley.completed
    });

    /*
     * 8. Load again to verify persistence
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
                    "essay-clarity"
                ) {
                    persistedTask = task;
                }
            }
        }
    }

    console.log(
        "\nPersisted Essay Clarity task:"
    );

    console.log(
        JSON.stringify(
            persistedTask,
            null,
            2
        )
    );

    /*
     * 9. Final result
     */

    console.log(
        "\n8. Final result..."
    );

    if (
        persistedTask &&
        persistedTask.completed === true
    ) {
        console.log(
            "SUCCESS: essay-clarity is completed and persisted."
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
        "ESSAY CLARITY TEST COMPLETE"
    );

    console.log(
        "======================================"
    );
}

run().catch(error => {
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