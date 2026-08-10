const {
    evaluateTask
} = require("./services/taskEvaluationService");


const task = {

    id: "essay-star-story",

    title:
        "Write using the STAR method",

    description:
        "Rewrite an important experience using Situation, Task, Action and Result."

};


const scholarship = {

    id: "chevening-001",

    name: "Chevening Scholarship"

};


const studentAnswer = `
During university, I led a student project to organize
a community technology workshop.

The situation was that many students in the community
did not have access to basic digital skills.

My task was to organize the workshop and coordinate
the volunteers.

I recruited 10 volunteers, created the workshop schedule,
and coordinated the sessions.

As a result, we trained 50 students and received positive
feedback from the participants.
`;


async function main() {

    try {

        console.log(
            "\nEvaluating student task...\n"
        );


        const result =
            await evaluateTask({

                task,

                studentAnswer,

                scholarship

            });


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


    } catch (error) {

        console.error(
            "\nTASK EVALUATION ERROR:\n",
            error.message
        );

    }

}


main();