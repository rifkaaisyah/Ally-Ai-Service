const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

async function run() {
    console.log("\n# ESSAY IMPACT TEST\n");

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

    for (const checkpoint of essayValley.checkpoints || []) {
        console.log(
            `${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
        );

        for (const task of checkpoint.tasks || []) {
            console.log(
                `• ${task.id} | completed=${task.completed}`
            );
        }
    }

    /*
     * 3. Find essay-impact dynamically
     */

    let selectedTask = null;

    for (const checkpoint of essayValley.checkpoints || []) {
        for (const task of checkpoint.tasks || []) {
            if (task.id === "essay-impact") {
                selectedTask = task;
                break;
            }
        }

        if (selectedTask) break;
    }

    if (!selectedTask) {
        throw new Error(
            "essay-impact task not found"
        );
    }

    console.log("\n3. Finding Essay Impact task...");

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
     * 4. Submit answer
     *
     * This answer intentionally contains:
     * - the experience
     * - student's role
     * - actions taken
     * - measurable impact
     */

    console.log(
        "\n4. Submitting Essay Impact answer..."
    );

    const taskResponse = await axios.post(
        `${BASE_URL}/api/journey/task/evaluate`,
        {
            studentId,
            taskId: selectedTask.id,
            

answer:
    "In a university research project, I led a team of 5 students and was responsible for coordinating our data collection and analysis. Before I changed our workflow, the team was processing around 20 survey responses per week. I introduced a weekly task allocation system, divided responsibilities among the 5 team members, and created a shared tracking sheet. After implementing this approach, we processed 60 survey responses per week, which was a 200% increase in weekly processing capacity. In total, we analyzed 200 survey responses and completed the project 2 weeks before the original deadline. I also identified and corrected 15 inconsistent survey records before the final analysis. These measurable results demonstrated my ability to use evidence, delegation, and structured planning to improve team performance."        }
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
                    "essay-impact"
                ) {
                    persistedTask = task;
                }
            }
        }
    }

    console.log(
        "\nPersisted Essay Impact task:"
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

    console.log("\n8. Final result...");

    if (
        persistedTask &&
        persistedTask.completed === true
    ) {
        console.log(
            "SUCCESS: essay-impact is completed and persisted."
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
        "ESSAY IMPACT TEST COMPLETE"
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