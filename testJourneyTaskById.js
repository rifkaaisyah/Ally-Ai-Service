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


/*
 * This test intentionally uses task IDs
 * instead of passing the entire task object.
 *
 * This represents the way the future API
 * will work:
 *
 * POST /journey/task/evaluate
 *
 * {
 *     taskId: "...",
 *     answer: "..."
 * }
 */


/*
 * First submission:
 *
 * This answer is intentionally weak.
 *
 * Expected:
 *
 * canComplete = false
 * task remains incomplete
 * progress remains unchanged
 */

const weakSubmission = {

    taskId: "research-collect",

    answer: `
I did some research projects at university.
I worked with other students and helped with research.
`

};


/*
 * Second submission:
 *
 * This answer contains much more specific
 * evidence about the research projects.
 *
 * Expected:
 *
 * canComplete = true
 * research-collect becomes completed
 * research-portfolio progress increases
 * Research Valley progress increases
 */

const strongSubmission = {

    taskId: "research-collect",

    answer: `
During university, I participated in two research projects.

The first project investigated machine learning applications
for education. I helped collect and clean student learning
data and supported the analysis of the results.

The second project studied student engagement in higher
education. I helped collect student responses, organize the
research data and analyze the findings with the research team.

I also contributed to preparing the final research
documentation and presenting the findings to our academic team.
`

};


async function main() {

    try {

        /*
         * Generate the initial journey.
         */

        let journey =
            generateValleys(
                studentProfile,
                journeyPlan,
                scholarship
            );


        console.log(
            "\n======================================"
        );

        console.log(
            "TEST: TASK SUBMISSION BY TASK ID"
        );

        console.log(
            "======================================\n"
        );


        /*
         * Show the initial state.
         */

        console.log(
            "INITIAL STATE:"
        );

        printTaskState(
            journey,
            weakSubmission.taskId
        );

        printJourneySummary(
            journey
        );


        /*
         * ------------------------------------
         * TEST 1: WEAK ANSWER
         * ------------------------------------
         */

        console.log(
            "\n======================================"
        );

        console.log(
            "TEST 1: WEAK ANSWER"
        );

        console.log(
            "======================================\n"
        );


        const weakResult =
            await submitTaskAnswer({

                journey,

                taskId:
                    weakSubmission.taskId,

                studentAnswer:
                    weakSubmission.answer,

                scholarship

            });


        console.log(
            "TASK EVALUATION:\n"
        );

        console.log(
            JSON.stringify(
                weakResult.evaluation,
                null,
                2
            )
        );


        /*
         * The returned journey becomes
         * the current journey.
         */

        journey =
            weakResult.journey;


        console.log(
            "\nTASK STATE AFTER WEAK ANSWER:\n"
        );

        printTaskState(
            journey,
            weakSubmission.taskId
        );


        console.log(
            "\nJOURNEY SUMMARY AFTER WEAK ANSWER:\n"
        );

        printJourneySummary(
            journey
        );


        /*
         * ------------------------------------
         * TEST 2: STRONG ANSWER
         * ------------------------------------
         */

        console.log(
            "\n======================================"
        );

        console.log(
            "TEST 2: STRONG ANSWER"
        );

        console.log(
            "======================================\n"
        );


        const strongResult =
            await submitTaskAnswer({

                journey,

                taskId:
                    strongSubmission.taskId,

                studentAnswer:
                    strongSubmission.answer,

                scholarship

            });


        console.log(
            "TASK EVALUATION:\n"
        );

        console.log(
            JSON.stringify(
                strongResult.evaluation,
                null,
                2
            )
        );


        /*
         * Update the journey with the
         * result of the strong submission.
         */

        journey =
            strongResult.journey;


        console.log(
            "\nTASK STATE AFTER STRONG ANSWER:\n"
        );

        printTaskState(
            journey,
            strongSubmission.taskId
        );


        console.log(
            "\nJOURNEY SUMMARY AFTER STRONG ANSWER:\n"
        );

        printJourneySummary(
            journey
        );


        /*
         * ------------------------------------
         * FINAL RESULT
         * ------------------------------------
         */

        console.log(
            "\n======================================"
        );

        console.log(
            "FINAL RESULT"
        );

        console.log(
            "======================================\n"
        );


        const finalTask =
            findTask(
                journey,
                strongSubmission.taskId
            );


        if (finalTask) {

            console.log(
                `Task: ${finalTask.id}`
            );

            console.log(
                `Completed: ${finalTask.completed}`
            );

        }


        const researchValley =
            journey.valleys.find(
                valley =>
                    valley.id === "research-valley"
            );


        if (researchValley) {

            console.log(
                `Research Valley progress: ${researchValley.progress}%`
            );

            console.log(
                `Research Valley status: ${researchValley.status}`
            );

        }


    } catch (error) {

        console.error(
            "\nJOURNEY TASK BY ID ERROR:\n",
            error
        );

    }

}


/**
 * Find a task anywhere inside
 * the journey.
 */
function findTask(
    journey,
    taskId
) {

    for (
        const valley
        of journey.valleys || []
    ) {

        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            for (
                const task
                of checkpoint.tasks || []
            ) {

                if (
                    task.id === taskId
                ) {

                    return task;

                }

            }

        }

    }

    return null;

}


/**
 * Print the current state
 * of one task.
 */
function printTaskState(
    journey,
    taskId
) {

    const task =
        findTask(
            journey,
            taskId
        );


    if (!task) {

        console.log(
            `Task not found: ${taskId}`
        );

        return;

    }


    console.log(
        `Task: ${task.id}`
    );

    console.log(
        `Title: ${task.title}`
    );

    console.log(
        `Completed: ${task.completed}`
    );

}


/**
 * Print a compact journey summary.
 */
function printJourneySummary(
    journey
) {

    for (
        const valley
        of journey.valleys || []
    ) {

        console.log(
            `${valley.order}. ${valley.name} | ` +
            `status=${valley.status} | ` +
            `progress=${valley.progress}% | ` +
            `completed=${valley.completed}`
        );


        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            console.log(
                `   - ${checkpoint.title} | ` +
                `progress=${checkpoint.progress}% | ` +
                `completed=${checkpoint.completed}`
            );

        }

    }

}


main();