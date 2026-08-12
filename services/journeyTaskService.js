const {
    evaluateTask
} = require("./taskEvaluationService");

const {
    updateJourneyProgress
} = require("./progressService");

const {
    planTimeline
} = require("./timelinePlanner");


/**
 * --------------------------------------------------
 * Submit a student's answer for a journey task.
 * --------------------------------------------------
 *
 * Flow:
 *
 * 1. Find task
 * 2. Evaluate answer
 * 3. Recalculate journey progress
 * 4. Make sure timeline exists
 * 5. Synchronize timeline statuses
 * 6. Return updated journey
 *
 * Timeline DATES are never regenerated when a task
 * is completed.
 *
 * Only timeline STATUS changes.
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
     * Remove the current task first so that an old
     * completed state cannot survive if the new
     * evaluation rejects the answer.
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
     * 4. Current evaluation decides completion.
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
     * 5. Recalculate journey progress.
     *
     * This updates:
     *
     * - task.completed
     * - checkpoint progress
     * - valley progress
     * - valley status
     *
     * It also synchronizes task-level timeline
     * status when timeline data exists there.
     * --------------------------------------------------
     */

    let updatedJourney =
        updateJourneyProgress(
            journey,
            completedTaskIds
        );


    /*
     * --------------------------------------------------
     * 6. Make sure the journey has a timeline.
     *
     * IMPORTANT:
     *
     * Generate the timeline BEFORE synchronizing
     * statuses.
     *
     * This fixes older journeys that were created
     * before timeline integration.
     * --------------------------------------------------
     */

    if (
        !updatedJourney.timeline
    ) {

        const timelineResult =
            planTimeline(
                updatedJourney
            );


        updatedJourney.timeline =
            timelineResult.timeline;

    }


    /*
     * --------------------------------------------------
     * 7. Synchronize timeline statuses.
     *
     * This updates BOTH:
     *
     * A. journey.valleys task timelines
     *
     * B. journey.timeline task timelines
     *
     * Dates are preserved.
     * --------------------------------------------------
     */

    syncTimelineStatuses(
        updatedJourney
    );


    /*
     * --------------------------------------------------
     * 8. Find the updated task.
     * --------------------------------------------------
     */

    const updatedTask =
        findTask(
            updatedJourney,
            taskId
        );


    /*
     * --------------------------------------------------
     * 9. Return everything needed by the route.
     * --------------------------------------------------
     */

    return {

        success: true,

        evaluation,

        task: {

            id:
                taskId,

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
 * --------------------------------------------------
 * Synchronize timeline statuses.
 * --------------------------------------------------
 *
 * This function NEVER changes:
 *
 * - start_date
 * - target_date
 *
 * It only changes:
 *
 * scheduled
 *     ↓
 * completed
 *
 * or:
 *
 * completed
 *     ↓
 * scheduled
 *
 * based on the actual task completion state.
 */
function syncTimelineStatuses(
    journey
) {

    if (!journey) {

        return;

    }


    /*
     * --------------------------------------------------
     * Build task completion lookup.
     * --------------------------------------------------
     */

    const taskStatusMap = {};


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

                taskStatusMap[
                    task.id
                ] =
                    task.completed === true;

            }

        }

    }


    /*
     * --------------------------------------------------
     * 1. Synchronize timeline stored directly
     *    on journey.valleys tasks.
     *
     * Example:
     *
     * journey.valleys[0]
     *   .checkpoints[0]
     *   .tasks[0]
     *   .timeline.status
     * --------------------------------------------------
     */

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
                    !task.timeline
                ) {

                    continue;

                }


                if (
                    Object.prototype.hasOwnProperty.call(
                        taskStatusMap,
                        task.id
                    )
                ) {

                    task.timeline.status =
                        taskStatusMap[
                            task.id
                        ]
                            ? "completed"
                            : "scheduled";

                }

            }

        }

    }


    /*
     * --------------------------------------------------
     * 2. Synchronize the separate journey.timeline
     *    representation.
     * --------------------------------------------------
     */

    if (
        journey.timeline &&
        Array.isArray(
            journey.timeline.valleys
        )
    ) {

        for (
            const timelineValley
            of journey.timeline.valleys
        ) {

            for (
                const timelineTask
                of timelineValley.tasks || []
            ) {

                if (
                    !Object.prototype.hasOwnProperty.call(
                        taskStatusMap,
                        timelineTask.id
                    )
                ) {

                    continue;

                }


                /*
                 * Make sure timeline metadata exists.
                 */

                timelineTask.timeline =
                    timelineTask.timeline || {};


                /*
                 * Preserve all dates and only change
                 * the status.
                 */

                timelineTask.timeline.status =
                    taskStatusMap[
                        timelineTask.id
                    ]
                        ? "completed"
                        : "scheduled";

            }

        }

    }

}


/**
 * --------------------------------------------------
 * Find a task anywhere inside the journey.
 * --------------------------------------------------
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
 * --------------------------------------------------
 * Get all currently completed task IDs.
 * --------------------------------------------------
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