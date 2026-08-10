const {
    planJourney
} = require("./services/journeyPlanner");


const today =
    new Date(2026, 7, 10);
// August 10, 2026


const profile = {

    readiness_percentage: 87

};


const chevening = {

    id: "chevening-001",

    name: "Chevening Scholarship",

    deadline: {

        application_period:
            "4 August - 6 October 2026"

    }

};


const lpdp = {

    id: "lpdp-001",

    name: "LPDP Scholarship",

    deadline: {

        application_period:
            "30 June - 31 July 2026"

    }

};


console.log("\nCHEVENING:");

console.log(
    JSON.stringify(
        planJourney(
            profile,
            chevening,
            today
        ),
        null,
        2
    )
);


console.log("\nLPDP:");

console.log(
    JSON.stringify(
        planJourney(
            profile,
            lpdp,
            today
        ),
        null,
        2
    )
);