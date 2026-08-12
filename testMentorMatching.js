const {
    matchMentor,
    rankMentors
} = require("./services/mentorMatchingService");

const mentors =
    require("./data/mentors.json");


const profile = {

    student_profile: {

        nationality:
            "Indonesia",

        academic: {

            study_direction:
                "Artificial Intelligence"

        },

        leadership: {

            experience: [
                "Student Organization"
            ]

        },

        career: {

            contribution_area:
                "Artificial Intelligence"

        }

    }

};


console.log("");
console.log("==============================");
console.log("MENTOR MATCHING TEST");
console.log("==============================");


const ranked =
    rankMentors(
        profile,
        mentors
    );


console.log("");
console.log("Ranked mentors:");


console.log(
    JSON.stringify(
        ranked,
        null,
        2
    )
);


const bestMentor =
    matchMentor(
        profile,
        mentors
    );


console.log("");
console.log("BEST MENTOR:");
console.log(
    JSON.stringify(
        bestMentor,
        null,
        2
    )
);


console.log("");
console.log("==============================");
console.log("MENTOR TEST COMPLETE");
console.log("==============================");