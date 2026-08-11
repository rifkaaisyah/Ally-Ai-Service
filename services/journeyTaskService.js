const {
    evaluateTask
} = require("./taskEvaluationService");

const {
    updateJourneyProgress
} = require("./progressService");


/**
 * Submit a student's answer for a journey task.
 *
 * The task is dynamically located inside
 * the student's saved journey.
 *
 * The task is marked completed ONLY when
 * the current AI evaluation says:
 *
 *     canComplete === true
 */
async function submitTaskAnswer({
    journey,
    taskId,
    studentAnswer,
    scholarship
}) {

    if (!journey) {
        throw new Error(
            "Journey is required"
        );
    }

    if (!taskId) {
        throw new Error(
            "Task ID is required"
        );
    }

    if (
        !studentAnswer ||
        !studentAnswer.trim()
    ) {
        throw new Error(
            "Student answer is required"
        );
    }


    /*
     * --------------------------------------------------
     * 1. Find the task dynamically.
     * --------------------------------------------------
     */

    const task =
        findTask(
            journey,
            taskId
        );


    if (!task) {
        throw new Error(
            `Task not found: ${taskId}`
        );
    }


    /*
     * --------------------------------------------------
     * 2. Evaluate the student's answer.
     * --------------------------------------------------
     */

    const evaluation =
        await evaluateTask({

            task,

            studentAnswer,

            scholarship

        });


    /*
     * --------------------------------------------------
     * 3. Get all OTHER completed tasks.
     *
     * IMPORTANT:
     *
     * We deliberately remove the current task
     * from the completion list first.
     *
     * This prevents an old/stale "completed: true"
     * value from surviving when the current answer
     * is rejected by the AI.
     * --------------------------------------------------
     */

    const completedTaskIds =
        getCompletedTaskIds(
            journey
        ).filter(
            id => id !== taskId
        );


    /*
     * --------------------------------------------------
     * 4. ONLY the current evaluation decides
     *    whether this task is completed.
     * --------------------------------------------------
     */

    if (
        evaluation.canComplete === true
    ) {

        completedTaskIds.push(
            taskId
        );

    }


    /*
     * --------------------------------------------------
     * 5. Recalculate the entire journey.
     * --------------------------------------------------
     */

    const updatedJourney =
        updateJourneyProgress(
            journey,
            completedTaskIds
        );


    /*
     * --------------------------------------------------
     * 6. Find the updated task.
     * --------------------------------------------------
     */

    const updatedTask =
        findTask(
            updatedJourney,
            taskId
        );


    /*
     * --------------------------------------------------
     * 7. Return everything needed by the route.
     * --------------------------------------------------
     */

    return {

        success: true,

        evaluation,

        task: {

            id: taskId,

            completed:
                updatedTask
                    ? updatedTask.completed
                    : false

        },

        journey:
            updatedJourney

    };
}


/**
 * Find a task anywhere inside the
 * student's generated journey.
 */
function findTask(
    journey,
    taskId
) {

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


/**
 * Get all currently completed task IDs.
 */
function getCompletedTaskIds(
    journey
) {

    const completedIds = [];


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
                    task.completed === true
                ) {

                    completedIds.push(
                        task.id
                    );

                }

            }

        }

    }


    return completedIds;
}


module.exports = {
    submitTaskAnswer
};