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
 * Answers for each research task.
 *
 * These are intentionally strong enough
 * for the evaluator to mark complete.
 */

const submissions = [

    {
        taskId: "research-collect",

        title: "Collect your research projects",

        answer: `
I participated in two research projects during university.

The first project investigated machine learning applications
for education. I helped collect and analyze research data.

The second project studied student engagement.
I worked with the research team to collect data,
analyze the results and prepare our findings.
        `
    },

    {
        taskId: "research-contribution",

        title: "Explain your contribution",

        answer: `
In the first research project, I was responsible for
collecting and cleaning data and supporting the analysis.

In the second project, I helped design the data collection
process, analyzed student responses and contributed to the
final research report.

My contribution helped the team organize the evidence
and produce clear findings.
        `
    },

    {
        taskId: "research-achievements",

        title: "Highlight research achievements",

        answer: `
My research work resulted in two completed research projects.

I presented the findings of the projects to my academic team
and contributed to the final research documentation.

The projects strengthened my research, data analysis and
academic communication skills.
        `
    },

    {
        taskId: "research-topic",

        title: "Define your research topic",

        answer: `
My proposed research topic is the use of machine learning
to improve personalized learning in higher education.

I want to investigate how learning systems can use student
data to identify learning difficulties and recommend
appropriate learning resources.

This topic connects my previous research experience with
my future academic goals.
        `
    },

    {
        taskId: "research-impact",

        title: "Explain the potential impact",

        answer: `
This research could help universities identify students
who need additional academic support earlier.

The potential impact includes improving access to
personalized learning resources, supporting student
engagement and helping educators make better decisions
using evidence.

The research could particularly benefit students who
struggle with traditional one-size-fits-all learning.
        `
    }

];


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
            "\n=============================="
        );

        console.log(
            "INITIAL JOURNEY"
        );

        console.log(
            "==============================\n"
        );

        console.log(
            JSON.stringify(
                journey,
                null,
                2
            )
        );


        /*
         * Submit each task one at a time.
         */

        for (
            const submission
            of submissions
        ) {

            const task = findTask(
                journey,
                submission.taskId
            );


            if (!task) {

                throw new Error(
                    `Task not found: ${submission.taskId}`
                );

            }


            console.log(
                "\n=============================="
            );

            console.log(
                `SUBMITTING: ${submission.title}`
            );

            console.log(
                "==============================\n"
            );


            const result =
                await submitTaskAnswer({

                    journey,

                    task,

                    studentAnswer:
                        submission.answer,

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


            /*
             * The returned journey becomes
             * the input for the next submission.
             */

            journey =
                result.journey;


            console.log(
                "\nJOURNEY SUMMARY:\n"
            );

            printJourneySummary(
                journey
            );

        }


        console.log(
            "\n=============================="
        );

        console.log(
            "FINAL JOURNEY"
        );

        console.log(
            "==============================\n"
        );

        console.log(
            JSON.stringify(
                journey,
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


/*
 * Find a task anywhere inside the journey.
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


/*
 * Print a compact summary instead of
 * printing the entire journey after
 * every submission.
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