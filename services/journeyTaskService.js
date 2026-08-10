const {
    evaluateTask
} = require("./taskEvaluationService");

const {
    updateJourneyProgress
} = require("./progressService");


async function submitTaskAnswer({
    journey,
    task,
    studentAnswer,
    scholarship
}) {

    if (!journey) {
        throw new Error(
            "Journey is required"
        );
    }

    if (!task) {
        throw new Error(
            "Task is required"
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
     * 1. Ask AI to evaluate the answer.
     */

    const evaluation =
        await evaluateTask({

            task,

            studentAnswer,

            scholarship

        });


    /*
     * 2. Find tasks that are already completed.
     */

    const completedTaskIds =
        getCompletedTaskIds(
            journey
        );


    /*
     * 3. Only add this task when
     *    the AI considers it complete.
     */

    if (
        evaluation.canComplete
    ) {

        if (
            !completedTaskIds.includes(
                task.id
            )
        ) {

            completedTaskIds.push(
                task.id
            );

        }

    }


    /*
     * 4. Recalculate the journey.
     */

    const updatedJourney =
        updateJourneyProgress(
            journey,
            completedTaskIds
        );


    return {

        evaluation,

        journey:
            updatedJourney

    };
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