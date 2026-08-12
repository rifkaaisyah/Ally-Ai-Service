const {
    parseDeadline
} = require("./deadlineService");

/**
 * Build a timeline for a student's scholarship journey.
 *
 * Responsibilities:
 * - Determine available preparation window
 * - Distribute tasks across that window
 * - Respect valley order
 * - Respect locked/current valley status
 * - Give every scheduled task a target date
 *
 * This service does NOT:
 * - calculate readiness
 * - recommend scholarships
 * - generate valleys
 * - evaluate task answers
 */
function planTimeline(
    journey,
    today = new Date()
) {

    if (!journey) {
        throw new Error(
            "Journey is required"
        );
    }

    if (!journey.scholarship) {
        throw new Error(
            "Journey scholarship is required"
        );
    }

    if (!Array.isArray(journey.valleys)) {
        throw new Error(
            "Journey valleys are required"
        );
    }

    // ---------------------------------------------------------
    // 1. Parse scholarship deadline
    // ---------------------------------------------------------

    const applicationPeriod =
        journey.scholarship.deadline?.application_period ||
        journey.scholarship.application_period ||
        "";

    const scholarshipDeadline =
        parseDeadline(
            applicationPeriod,
            today
        );

    // ---------------------------------------------------------
    // 2. Determine target date
    // ---------------------------------------------------------

    const targetDate =
        getTargetDate(
            scholarshipDeadline,
            today
        );

    // ---------------------------------------------------------
    // 3. Clone journey
    //
    // Never mutate the original journey directly.
    // ---------------------------------------------------------

    const timelineJourney =
        JSON.parse(
            JSON.stringify(journey)
        );

    // ---------------------------------------------------------
    // 4. Build timeline
    // ---------------------------------------------------------

    const timeline =
        buildTimeline(
            timelineJourney.valleys,
            today,
            targetDate
        );

    // ---------------------------------------------------------
    // 5. Attach timeline metadata
    // ---------------------------------------------------------

    timelineJourney.timeline = {

        start_date:
            formatDate(today),

        target_date:
            targetDate
                ? formatDate(targetDate)
                : null,

        deadline:
            scholarshipDeadline,

        total_days:
            targetDate
                ? calculateDaysBetween(
                    normalizeDate(today),
                    normalizeDate(targetDate)
                )
                : null,

        timeline_status:
            targetDate
                ? "planned"
                : "needs_deadline_verification",

        valleys:
            timeline

    };

    return timelineJourney;
}

/**
 * Decide which date the student should work toward.
 *
 * Exact deadline:
 *     deadline_date
 *
 * Estimated deadline:
 *     estimated_deadline_date
 *
 * Unknown:
 *     null
 */
function getTargetDate(
    deadline,
    today
) {

    if (!deadline) {
        return null;
    }

    if (
        deadline.deadline_precision === "exact" &&
        deadline.deadline_date
    ) {

        return parseDate(
            deadline.deadline_date
        );

    }

    if (
        deadline.deadline_precision === "estimated" &&
        deadline.estimated_deadline_date
    ) {

        return parseDate(
            deadline.estimated_deadline_date
        );

    }

    return null;
}

/**
 * Build dates for valleys and tasks.
 *
 * V1 scheduling model:
 *
 * current valley
 *      ↓
 * schedule its incomplete tasks
 *
 * locked valleys
 *      ↓
 * remain locked and have no scheduled tasks
 */
function buildTimeline(
    valleys,
    today,
    targetDate
) {

    const currentDate =
        normalizeDate(today);

    const scheduledValleys = [];

    const activeValleys =
        valleys.filter(
            valley =>
                valley.status === "current"
        );

    const lockedValleys =
        valleys.filter(
            valley =>
                valley.status === "locked"
        );

    // ---------------------------------------------------------
    // Schedule current valley
    // ---------------------------------------------------------

    const activeTasks =
        flattenTasks(
            activeValleys
        );

    const availableDays =
        targetDate
            ? Math.max(
                1,
                calculateDaysBetween(
                    currentDate,
                    normalizeDate(
                        targetDate
                    )
                )
            )
            : null;

    const taskDuration =
        calculateTaskDuration(
            activeTasks.length,
            availableDays
        );

    let cursor =
        new Date(
            currentDate
        );

    for (
        const valley
        of activeValleys
    ) {

        const valleyTasks = [];

        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            for (
                const task
                of checkpoint.tasks || []
            ) {

                /*
                 * Completed tasks should still be represented
                 * in the timeline if they already have dates.
                 *
                 * If there is no existing timeline information,
                 * give them dates using the current schedule.
                 */

                const existingTimeline =
                    task.timeline || {};

                const startDate =
                    existingTimeline.start_date
                        ? parseDate(
                            existingTimeline.start_date
                        )
                        : new Date(
                            cursor
                        );

                const endDate =
                    existingTimeline.target_date
                        ? parseDate(
                            existingTimeline.target_date
                        )
                        : addDays(
                            startDate,
                            taskDuration - 1
                        );

                task.timeline = {

                    start_date:
                        formatDate(
                            startDate
                        ),

                    target_date:
                        formatDate(
                            endDate
                        ),

                    status:
                        task.completed === true
                            ? "completed"
                            : "scheduled"

                };

                valleyTasks.push(
                    task
                );

                /*
                 * Only move the scheduling cursor forward for
                 * tasks that were newly scheduled.
                 *
                 * Existing dates remain stable.
                 */

                if (
                    !existingTimeline.start_date &&
                    !existingTimeline.target_date
                ) {

                    cursor =
                        addDays(
                            endDate,
                            1
                        );

                }

            }

        }

        scheduledValleys.push({

            valley_id:
                valley.id,

            status:
                valley.status,

            timeline_status:
                "scheduled",

            tasks:
                valleyTasks

        });

    }

    // ---------------------------------------------------------
    // Locked valleys
    // ---------------------------------------------------------

    for (
        const valley
        of lockedValleys
    ) {

        scheduledValleys.push({

            valley_id:
                valley.id,

            status:
                "locked",

            timeline_status:
                "locked",

            tasks: []

        });

    }

    return scheduledValleys;
}

/**
 * Convert valleys/checkpoints/tasks into a flat task list.
 *
 * Used only for calculating the initial task duration.
 */
function flattenTasks(
    valleys
) {

    const tasks = [];

    for (
        const valley
        of valleys
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
                    task.completed !== true
                ) {

                    tasks.push(
                        task
                    );

                }

            }

        }

    }

    return tasks;
}

/**
 * Determine how many days each task receives.
 *
 * V1:
 * - Minimum 3 days
 * - Maximum 14 days
 * - Default 7 days when deadline is unknown
 */
function calculateTaskDuration(
    taskCount,
    availableDays
) {

    if (
        taskCount <= 0
    ) {

        return 1;

    }

    if (
        !availableDays
    ) {

        return 7;

    }

    const calculated =
        Math.floor(
            availableDays /
            taskCount
        );

    return Math.max(
        3,
        Math.min(
            14,
            calculated
        )
    );
}

/**
 * Add days to a date.
 */
function addDays(
    date,
    days
) {

    const result =
        new Date(
            date
        );

    result.setDate(
        result.getDate() +
        days
    );

    return result;
}

/**
 * Parse YYYY-MM-DD safely.
 */
function parseDate(
    value
) {

    if (!value) {
        return null;
    }

    const parts =
        String(value)
            .split("-")
            .map(Number);

    if (
        parts.length !== 3 ||
        parts.some(
            Number.isNaN
        )
    ) {

        return null;

    }

    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );
}

/**
 * Normalize a date to midnight.
 */
function normalizeDate(
    date
) {

    const result =
        new Date(
            date
        );

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}

/**
 * Calculate number of days between dates.
 */
function calculateDaysBetween(
    startDate,
    endDate
) {

    const millisecondsPerDay =
        1000 *
        60 *
        60 *
        24;

    return Math.ceil(
        (
            endDate.getTime() -
            startDate.getTime()
        ) /
        millisecondsPerDay
    );
}

/**
 * Format date as YYYY-MM-DD.
 */
function formatDate(
    date
) {

    if (!date) {
        return null;
    }

    const normalized =
        normalizeDate(
            date
        );

    const year =
        normalized.getFullYear();

    const month =
        String(
            normalized.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            normalized.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}

module.exports = {

    planTimeline,

    getTargetDate,

    calculateTaskDuration

};