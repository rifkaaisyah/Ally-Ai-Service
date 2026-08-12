/**
 * Progress Service
 *
 * Handles student progress through the scholarship journey.
 *
 * This service does NOT use AI.
 *
 * It calculates:
 * - task completion
 * - task timeline status
 * - checkpoint progress
 * - valley progress
 * - which valley is current
 * - which valleys are locked/completed
 */

function updateJourneyProgress(
    journey,
    completedTaskIds = []
) {

    if (
        !journey ||
        !Array.isArray(journey.valleys)
    ) {
        throw new Error(
            "Invalid journey data"
        );
    }


    const completedSet =
        new Set(
            completedTaskIds
        );


    let previousValleyCompleted = true;


    const updatedValleys =
        journey.valleys.map(
            valley => {

                let totalTasks = 0;

                let completedTasks = 0;


                const updatedCheckpoints =
                    (valley.checkpoints || []).map(
                        checkpoint => {

                            const updatedTasks =
                                (checkpoint.tasks || []).map(
                                    task => {

                                        const completed =
                                            completedSet.has(
                                                task.id
                                            );


                                        totalTasks += 1;


                                        if (completed) {

                                            completedTasks += 1;

                                        }


                                        /*
                                         * Keep the existing
                                         * timeline dates.
                                         *
                                         * Only update the
                                         * timeline status.
                                         */

                                        let updatedTimeline =
                                            task.timeline;


                                        if (
                                            task.timeline
                                        ) {

                                            updatedTimeline = {

                                                ...task.timeline,

                                                status:
                                                    completed
                                                        ? "completed"
                                                        : "scheduled"

                                            };

                                        }


                                        return {

                                            ...task,

                                            completed,

                                            ...(updatedTimeline
                                                ? {
                                                    timeline:
                                                        updatedTimeline
                                                }
                                                : {})

                                        };

                                    }
                                );


                            const checkpointTotal =
                                updatedTasks.length;


                            const checkpointCompleted =
                                updatedTasks.filter(
                                    task =>
                                        task.completed
                                ).length;


                            const checkpointProgress =
                                checkpointTotal === 0
                                    ? 0
                                    : Math.round(
                                        (
                                            checkpointCompleted /
                                            checkpointTotal
                                        ) *
                                        100
                                    );


                            return {

                                ...checkpoint,

                                tasks:
                                    updatedTasks,

                                progress:
                                    checkpointProgress,

                                completed:
                                    checkpointTotal > 0 &&
                                    checkpointCompleted ===
                                        checkpointTotal

                            };

                        }
                    );


                const valleyProgress =
                    totalTasks === 0
                        ? 0
                        : Math.round(
                            (
                                completedTasks /
                                totalTasks
                            ) *
                            100
                        );


                const valleyCompleted =
                    totalTasks > 0 &&
                    completedTasks === totalTasks;


                let status;


                if (valleyCompleted) {

                    status =
                        "completed";

                }

                else if (
                    previousValleyCompleted
                ) {

                    status =
                        "current";

                }

                else {

                    status =
                        "locked";

                }


                /*
                 * Only a completed valley
                 * can unlock the next valley.
                 */

                previousValleyCompleted =
                    valleyCompleted;


                return {

                    ...valley,

                    checkpoints:
                        updatedCheckpoints,

                    status,

                    progress:
                        valleyProgress,

                    completed:
                        valleyCompleted

                };

            }
        );


    return {

        ...journey,

        valleys:
            updatedValleys

    };

}


module.exports = {

    updateJourneyProgress

};