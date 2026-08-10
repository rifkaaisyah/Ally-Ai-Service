const {
    evaluateTask
} = require("./taskEvaluationService");

const {
    updateJourneyProgress
} = require("./progressService");


/**
 * Submit a student's answer for a task.
 *
 * The task is identified by taskId and
 * looked up inside the supplied journey.
 *
 * This keeps the service compatible with
 * dynamically generated journeys.
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
     * 1. Find the task inside the
     *    student's generated journey.
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
     * 2. Ask the AI to evaluate
     *    the student's answer.
     */

    const evaluation =
        await evaluateTask({

            task,

            studentAnswer,

            scholarship

        });


    /*
     * 3. Get the task IDs that are
     *    already completed.
     */

    const completedTaskIds =
        getCompletedTaskIds(
            journey
        );


    /*
     * 4. Only mark this task as
     *    completed when the evaluator
     *    allows completion.
     */

    if (
        evaluation.canComplete
    ) {

        if (
            !completedTaskIds.includes(
                taskId
            )
        ) {

            completedTaskIds.push(
                taskId
            );

        }

    }


    /*
     * 5. Recalculate the complete
     *    journey using the existing
     *    progress service.
     *
     *    If the evaluation failed,
     *    the existing completed task
     *    IDs are preserved, so this
     *    submission does not complete
     *    the task.
     */

    const updatedJourney =
        updateJourneyProgress(
            journey,
            completedTaskIds
        );


    /*
     * 6. Find the updated task so
     *    the frontend can immediately
     *    see its completion state.
     */

    const updatedTask =
        findTask(
            updatedJourney,
            taskId
        );


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
 * Find a task anywhere inside
 * the student's generated journey.
 *
 * No task IDs are hardcoded here.
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
 * Get all completed task IDs
 * from the current journey.
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