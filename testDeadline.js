const {
    parseDeadline
} = require("./services/deadlineService");

const testDate =
    new Date("2026-08-10");

console.log(
    "LPDP:"
);

console.log(
    parseDeadline(
        "30 June - 31 July 2026",
        testDate
    )
);


console.log(
    "Chevening:"
);

console.log(
    parseDeadline(
        "4 August - 6 October 2026",
        testDate
    )
);


console.log(
    "Australia Awards:"
);

console.log(
    parseDeadline(
        "Usually February-April",
        testDate
    )
);


console.log(
    "DAAD:"
);

console.log(
    parseDeadline(
        "Varies by university (typically August-October annually)",
        testDate
    )
);