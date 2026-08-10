const {
    saveJourney,
    loadJourney,
    journeyExists
} = require("./services/journeyStore");


const studentId =
    "student-001";


const testJourney = {

    scholarship: {

        id: "chevening-001",

        name: "Chevening Scholarship"

    },

    valleys: [

        {

            id: "research-valley",

            status: "current",

            progress: 20,

            completed: false

        }

    ]

};


console.log(
    "\n=============================="
);

console.log(
    "TEST JOURNEY STORE"
);

console.log(
    "==============================\n"
);


/*
 * Save
 */

console.log(
    "Saving journey..."
);


saveJourney(
    studentId,
    testJourney
);


console.log(
    "Journey saved."
);


/*
 * Check existence
 */

console.log(
    "\nJourney exists:"
);


console.log(
    journeyExists(
        studentId
    )
);


/*
 * Load
 */

console.log(
    "\nLoading journey..."
);


const loadedJourney =
    loadJourney(
        studentId
    );


console.log(
    JSON.stringify(
        loadedJourney,
        null,
        2
    )
);