const {
    parseDeadline
} = require("./deadlineService");


/**
 * Decide whether a student should target
 * the current scholarship cycle or the next cycle.
 *
 * This is intentionally rule-based.
 * We do NOT use AI for this decision yet.
 */
function planJourney(
    profile,
    scholarship,
    today = new Date()
) {

    if (!profile) {
        throw new Error(
            "Student profile is required"
        );
    }

    if (!scholarship) {
        throw new Error(
            "Scholarship is required"
        );
    }


    // ---------------------------------------------------------
    // 1. Parse scholarship deadline
    // ---------------------------------------------------------

    const applicationPeriod =
        scholarship.deadline?.application_period || "";

    const deadline =
        parseDeadline(
            applicationPeriod,
            today
        );


    // ---------------------------------------------------------
    // 2. Get student readiness
    // ---------------------------------------------------------

    const readiness =
        getReadiness(profile);


    // ---------------------------------------------------------
    // 3. Determine strategy
    // ---------------------------------------------------------

    let strategy = "current_cycle";

    let feasibility = "unknown";

    let urgency = "normal";


    // ---------------------------------------------------------
    // CLOSED EXACT DEADLINE
    // ---------------------------------------------------------

    if (
        deadline.strategy === "next_cycle" &&
        deadline.deadline_precision === "exact"
    ) {

        strategy = "next_cycle";

        feasibility = "strong";

        urgency = "low";

    }


    // ---------------------------------------------------------
    // CURRENT EXACT DEADLINE
    // ---------------------------------------------------------

    else if (
        deadline.deadline_precision === "exact"
    ) {

        const daysRemaining =
            deadline.days_remaining;


        if (daysRemaining <= 30) {

            urgency = "high";

        }

        else if (daysRemaining <= 90) {

            urgency = "medium";

        }


        feasibility =
            calculateFeasibility(
                readiness,
                daysRemaining
            );


        if (
            feasibility === "low"
        ) {

            strategy = "next_cycle";

        }

        else {

            strategy = "current_cycle";

        }

    }


    // ---------------------------------------------------------
    // ESTIMATED DEADLINE
    // ---------------------------------------------------------

    else if (
        deadline.deadline_precision === "estimated"
    ) {

        strategy =

            deadline.strategy === "next_cycle"
                ? "next_cycle"
                : "current_cycle";

        feasibility =
            "unknown";

        urgency =
            "normal";

    }


    // ---------------------------------------------------------
    // UNKNOWN DEADLINE
    // ---------------------------------------------------------

    else {

        strategy = "conservative";

        feasibility = "unknown";

        urgency = "normal";

    }


    return {

        strategy,

        feasibility,

        urgency,

        readiness,

        deadline

    };

}


/**
 * Extract readiness from different profile formats.
 */
function getReadiness(profile) {

    if (
        typeof profile.readiness_percentage === "number"
    ) {

        return profile.readiness_percentage;

    }


    if (
        typeof profile.readiness === "number"
    ) {

        return profile.readiness;

    }


    if (
        profile.assessment &&
        typeof profile.assessment.revised_percentage === "number"
    ) {

        return profile.assessment.revised_percentage;

    }


    // Conservative default.
    return 0;

}


/**
 * Determine whether the student can realistically
 * prepare within the remaining time.
 *
 * This is a simple first version.
 * We can make this more sophisticated later
 * using actual scholarship requirements and gaps.
 */
function calculateFeasibility(
    readiness,
    daysRemaining
) {

    if (daysRemaining <= 0) {

        return "low";

    }


    // Very high readiness.
    if (
        readiness >= 80 &&
        daysRemaining >= 14
    ) {

        return "high";

    }


    // Good readiness with limited time.
    if (
        readiness >= 65 &&
        daysRemaining >= 30
    ) {

        return "high";

    }


    // Medium readiness.
    if (
        readiness >= 50 &&
        daysRemaining >= 60
    ) {

        return "medium";

    }


    // Lower readiness needs more time.
    if (
        readiness < 50 &&
        daysRemaining < 90
    ) {

        return "low";

    }


    return "medium";

}


module.exports = {

    planJourney,

    getReadiness,

    calculateFeasibility

};