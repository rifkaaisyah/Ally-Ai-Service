const {
    generateValleys
} = require("./services/valleyGenerator");

const {
    updateJourneyProgress
} = require("./services/progressService");


// ---------------------------------------------------------
// Mock student profile
// ---------------------------------------------------------

const studentProfile = {

    academic: {

        academic_experiences: [
            "research_experience"
        ]

    },

    leadership: true

};


// ---------------------------------------------------------
// Scholarship
// ---------------------------------------------------------

const scholarship = {

    id: "chevening-001",

    name: "Chevening Scholarship"

};


// ---------------------------------------------------------
// Journey planner result
// ---------------------------------------------------------

const journeyInfo = {

    strategy: "current_cycle",

    feasibility: "high",

    urgency: "medium",

    readiness: 87

};


// ---------------------------------------------------------
// 1. Generate the journey
// ---------------------------------------------------------

const journey = generateValleys(

    studentProfile,

    journeyInfo,

    scholarship

);


// ---------------------------------------------------------
// 2. Initial progress
// ---------------------------------------------------------

const initialProgress =
    updateJourneyProgress(

        journey,

        []

    );


console.log(
    "\nINITIAL JOURNEY:\n"
);

console.log(
    JSON.stringify(
        initialProgress,
        null,
        2
    )
);


// ---------------------------------------------------------
// 3. Complete Research Valley
// ---------------------------------------------------------

const completedTaskIds = [

    "research-collect",

    "research-contribution",

    "research-achievements"

];


const updatedProgress =
    updateJourneyProgress(

        journey,

        completedTaskIds

    );


console.log(
    "\nAFTER COMPLETING RESEARCH VALLEY:\n"
);

console.log(
    JSON.stringify(
        updatedProgress,
        null,
        2
    )
);