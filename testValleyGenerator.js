const {
    generateValleys
} = require("./services/valleyGenerator");


const studentProfile = {

    academic: {

        academic_experiences: [
            "research_experience"
        ]

    },

    leadership: true

};


const journeyPlan = {

    strategy: "current_cycle",

    feasibility: "high",

    urgency: "medium",

    readiness: 87

};


const scholarship = {

    id: "chevening-001",

    name: "Chevening Scholarship"

};


const result =
    generateValleys(
        studentProfile,
        journeyPlan,
        scholarship
    );


console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);