const {
    loadJourney
} = require("./journeyStore");

const {
    planTimeline
} = require("./timelinePlanner");

const studentId =
    "student-readiness-deep-84-api-test-002";

const journey =
    loadJourney(
        studentId
    );

if (!journey) {

    console.error(
        "Journey not found"
    );

    process.exit(1);
}

console.log(
    "\n=== JOURNEY TIMELINE TEST ===\n"
);

console.log(
    "Student:",
    studentId
);

console.log(
    "\nReadiness:",
    journey.readiness
);

console.log(
    "\nAssessment:"
);

console.log(
    JSON.stringify(
        journey.assessment,
        null,
        2
    )
);

console.log(
    "\nExisting timeline:"
);

console.log(
    JSON.stringify(
        journey.timeline,
        null,
        2
    )
);


// ---------------------------------------------------------
// If timeline does not exist,
// generate it from the saved journey.
// ---------------------------------------------------------

if (!journey.timeline) {

    console.log(
        "\nNo saved timeline found."
    );

    console.log(
        "Generating timeline now..."
    );

    const result =
        planTimeline(
            journey
        );

    console.log(
        "\nGenerated timeline:"
    );

    console.log(
        JSON.stringify(
            result.timeline,
            null,
            2
        )
    );

} else {

    console.log(
        "\nSaved timeline found successfully."
    );
}

console.log(
    "\n=== END ==="
);