const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

async function run() {

    console.log("======================================");
    console.log("LEADERSHIP STORY TEST");
    console.log("======================================");

    const taskId = "leadership-star";

    console.log("\n1. Submitting leadership STAR story...");
    console.log("Task ID:", taskId);

    const answer =
        "During a university research project, I was responsible for coordinating a team of 5 students who were collecting and analyzing research data. The main challenge was that team members were working at different speeds, which was causing delays in the project. I organized weekly meetings, divided the work according to each member's strengths, created a simple progress schedule, and followed up with members who were falling behind. As a result, the team completed the research activities within the planned timeline and successfully delivered the final presentation. This experience taught me how to communicate clearly, delegate responsibilities, solve problems, and keep a team focused on a shared goal.";

    const response = await axios.post(
        `${BASE_URL}/api/journey/task/evaluate`,
        {
            studentId,
            taskId,
            answer
        }
    );

    console.log(
        "Status:",
        response.status
    );

    console.log("\nEvaluation:");

    console.log(
        JSON.stringify(
            response.data.evaluation,
            null,
            2
        )
    );

    console.log("\nUpdated task:");

    console.log(
        JSON.stringify(
            response.data.task,
            null,
            2
        )
    );

    const journey =
        response.data.journey;

    console.log("\nJourney progress:");

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    const leadership =
        journey.valleys?.find(
            valley =>
                valley.id === "leadership-valley"
        );

    console.log(
        "Leadership Valley:",
        leadership?.progress + "%"
    );

    console.log(
        "Leadership Valley status:",
        leadership?.status
    );

    console.log("\nCheckpoints:");

    for (
        const checkpoint
        of leadership?.checkpoints || []
    ) {

        console.log(
            `${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
        );

        for (
            const task
            of checkpoint.tasks || []
        ) {

            console.log(
                `  • ${task.id} | completed=${task.completed}`
            );

        }

    }

    console.log("\n======================================");
    console.log("LEADERSHIP STORY TEST COMPLETE");
    console.log("======================================");
}

run().catch(error => {

    console.error("\nTEST FAILED");

    if (error.response) {

        console.error(
            "Status:",
            error.response.status
        );

        console.error(
            "Response:",
            error.response.data
        );

    } else {

        console.error(
            error.message
        );

    }

});