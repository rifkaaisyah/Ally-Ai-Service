const {
    generateValleys
} = require("./services/valleyGenerator");

const {
    submitTaskAnswer
} = require("./services/journeyTaskService");


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


const task = {

    id: "research-collect",

    title:
        "Collect your research projects",

    description:
        "List the research projects you have participated in.",

    type: "evidence"

};


const studentAnswer = `
I participated in two research projects during university.

The first project investigated machine learning applications
for education.

The second project studied student engagement.

I worked with my research team to collect data,
analyze the results and prepare our findings.
`;


async function main() {

    try {

        /*
         * Generate the journey.
         */

        const journey =
            generateValleys(

                studentProfile,

                journeyPlan,

                scholarship

            );


        console.log(
            "\nBEFORE SUBMISSION:\n"
        );

        console.log(
            JSON.stringify(
                journey,
                null,
                2
            )
        );


        /*
         * Submit the student's answer.
         */

        const result =
            await submitTaskAnswer({

                journey,

                task,

                studentAnswer,

                scholarship

            });


        console.log(
            "\nTASK EVALUATION:\n"
        );

        console.log(
            JSON.stringify(
                result.evaluation,
                null,
                2
            )
        );


        console.log(
            "\nAFTER SUBMISSION:\n"
        );

        console.log(
            JSON.stringify(
                result.journey,
                null,
                2
            )
        );


    } catch (error) {

        console.error(
            "\nJOURNEY TASK ERROR:\n",
            error
        );

    }

}


main();