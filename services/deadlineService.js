const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
};

function parseDeadline(applicationPeriod, today = new Date()) {
    const raw =
        typeof applicationPeriod === "string"
            ? applicationPeriod.trim()
            : "";

    if (!raw) {
        return buildUnknownDeadline(raw, today);
    }

    // Example: "30 June - 31 July 2026"
    const exactRange = raw.match(
        /(\d{1,2})\s+([A-Za-z]+)\s*-\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i
    );

    if (exactRange) {
        const startDay = Number(exactRange[1]);
        const startMonth = parseMonth(exactRange[2]);

        const endDay = Number(exactRange[3]);
        const endMonth = parseMonth(exactRange[4]);

        const year = Number(exactRange[5]);

        if (
            startMonth !== null &&
            endMonth !== null
        ) {
            const startDate = createDate(
                year,
                startMonth,
                startDay
            );

            const deadlineDate = createDate(
                year,
                endMonth,
                endDay
            );

            return normalizeDeadline({
                source: raw,
                deadlinePrecision: "exact",
                applicationStartDate: startDate,
                deadlineDate,
                today
            });
        }
    }

    // Example: "31 July 2026"
    const exactDate = raw.match(
        /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i
    );

    if (exactDate) {
        const day = Number(exactDate[1]);
        const month = parseMonth(exactDate[2]);
        const year = Number(exactDate[3]);

        if (month !== null) {
            const deadlineDate = createDate(
                year,
                month,
                day
            );

            return normalizeDeadline({
                source: raw,
                deadlinePrecision: "exact",
                applicationStartDate: null,
                deadlineDate,
                today
            });
        }
    }

    // Example: "February-April 2027"
    const monthRangeWithYear = raw.match(
        /([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})/i
    );

    if (monthRangeWithYear) {
        const startMonth = parseMonth(
            monthRangeWithYear[1]
        );

        const endMonth = parseMonth(
            monthRangeWithYear[2]
        );

        const year = Number(
            monthRangeWithYear[3]
        );

        if (
            startMonth !== null &&
            endMonth !== null
        ) {
            const estimatedDeadline = createDate(
                year,
                endMonth,
                getLastDayOfMonth(
                    year,
                    endMonth
                )
            );

            return buildEstimatedDeadline({
                source: raw,
                applicationStartMonth: startMonth,
                applicationEndMonth: endMonth,
                deadlineDate: estimatedDeadline,
                today,
                year
            });
        }
    }

    // Example: "Usually February-April"
    const monthRange = raw.match(
        /([A-Za-z]+)\s*-\s*([A-Za-z]+)/i
    );

    if (monthRange) {
        const startMonth = parseMonth(
            monthRange[1]
        );

        const endMonth = parseMonth(
            monthRange[2]
        );

        if (
            startMonth !== null &&
            endMonth !== null
        ) {
            const estimatedYear =
                inferUpcomingYear(
                    endMonth,
                    today
                );

            const estimatedDeadline = createDate(
                estimatedYear,
                endMonth,
                getLastDayOfMonth(
                    estimatedYear,
                    endMonth
                )
            );

            return buildEstimatedDeadline({
                source: raw,
                applicationStartMonth: startMonth,
                applicationEndMonth: endMonth,
                deadlineDate: estimatedDeadline,
                today,
                year: estimatedYear
            });
        }
    }

    // Example: "May 2027"
    const singleMonthWithYear = raw.match(
        /(?:usually\s+)?([A-Za-z]+)\s+(\d{4})/i
    );

    if (singleMonthWithYear) {
        const month = parseMonth(
            singleMonthWithYear[1]
        );

        const year = Number(
            singleMonthWithYear[2]
        );

        if (month !== null) {
            const estimatedDeadline = createDate(
                year,
                month,
                getLastDayOfMonth(
                    year,
                    month
                )
            );

            return buildEstimatedDeadline({
                source: raw,
                applicationStartMonth: month,
                applicationEndMonth: month,
                deadlineDate: estimatedDeadline,
                today,
                year
            });
        }
    }

    return buildUnknownDeadline(
        raw,
        today
    );
}

function normalizeDeadline({
    source,
    deadlinePrecision,
    applicationStartDate,
    deadlineDate,
    today
}) {
    const todayDate = normalizeDate(today);
    const normalizedDeadline =
        normalizeDate(deadlineDate);

    let currentCycleStatus;

    if (normalizedDeadline < todayDate) {
        currentCycleStatus = "closed";
    } else if (
        applicationStartDate &&
        normalizeDate(applicationStartDate) > todayDate
    ) {
        currentCycleStatus = "upcoming";
    } else {
        currentCycleStatus = "open";
    }

    const daysRemaining = calculateDaysBetween(
        todayDate,
        normalizedDeadline
    );

    const recommendedCycle =
        normalizedDeadline.getFullYear() +
        (
            currentCycleStatus === "closed"
                ? 1
                : 0
        );

    return {
        deadline_source: "scholarship_data",

        deadline_precision:
            deadlinePrecision,

        application_period: source,

        application_start_date:
            applicationStartDate
                ? formatDate(applicationStartDate)
                : null,

        deadline_date:
            formatDate(normalizedDeadline),

        current_cycle_status:
            currentCycleStatus,

        days_remaining:
            daysRemaining,

        recommended_cycle:
            recommendedCycle,

        strategy:
            currentCycleStatus === "closed"
                ? "next_cycle"
                : "current_cycle",

        requires_deadline_verification:
            false
    };
}

function buildEstimatedDeadline({
    source,
    applicationStartMonth,
    applicationEndMonth,
    deadlineDate,
    today,
    year
}) {
    const todayDate = normalizeDate(today);

    const normalizedDeadline =
        normalizeDate(deadlineDate);

    const currentCycleStatus =
        normalizedDeadline < todayDate
            ? "estimated_closed"
            : "estimated";

    const daysRemaining = calculateDaysBetween(
        todayDate,
        normalizedDeadline
    );

    return {
        deadline_source: "scholarship_data",

        deadline_precision: "estimated",

        application_period: source,

        application_start_date: null,

        deadline_date: null,

        estimated_deadline_date:
            formatDate(normalizedDeadline),

        estimated_application_start_month:
            applicationStartMonth,

        estimated_application_end_month:
            applicationEndMonth,

        current_cycle_status:
            currentCycleStatus,

        days_remaining:
            daysRemaining,

        recommended_cycle:
            currentCycleStatus === "estimated_closed"
                ? year + 1
                : year,

        strategy:
            currentCycleStatus === "estimated_closed"
                ? "next_cycle"
                : "conservative",

        requires_deadline_verification:
            true
    };
}

function buildUnknownDeadline(
    source,
    today
) {
    const year = today.getFullYear();

    return {
        deadline_source: "scholarship_data",

        deadline_precision: "unknown",

        application_period:
            source || null,

        application_start_date: null,

        deadline_date: null,

        estimated_deadline_date: null,

        current_cycle_status: "unknown",

        days_remaining: null,

        recommended_cycle: year,

        strategy: "conservative",

        requires_deadline_verification:
            true
    };
}

function parseMonth(monthName) {
    if (!monthName) {
        return null;
    }

    const normalized =
        monthName
            .toLowerCase()
            .trim();

    if (
        Object.prototype.hasOwnProperty.call(
            MONTHS,
            normalized
        )
    ) {
        return MONTHS[normalized];
    }

    return null;
}

function createDate(
    year,
    month,
    day
) {
    return new Date(
        year,
        month,
        day
    );
}

function normalizeDate(date) {
    const normalized = new Date(date);

    normalized.setHours(
        0,
        0,
        0,
        0
    );

    return normalized;
}

function getLastDayOfMonth(
    year,
    month
) {
    return new Date(
        year,
        month + 1,
        0
    ).getDate();
}

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

function inferUpcomingYear(
    month,
    today
) {
    const currentYear =
        today.getFullYear();

    const currentMonth =
        today.getMonth();

    if (month < currentMonth) {
        return currentYear + 1;
    }

    return currentYear;
}

function formatDate(date) {
    if (!date) {
        return null;
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

module.exports = {
    parseDeadline
};