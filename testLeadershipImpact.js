const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

async function run() {

    console.log("======================================");
    console.log("LEADERSHIP IMPACT TEST");
    console.log("======================================");

    const taskId = "leadership-impact";

    console.log("\n1. Submitting leadership impact...");
    console.log("Task ID:", taskId);

    const answer =
        "The research project involved a team of 5 students and required us to coordinate data collection, analysis, and the final presentation. As the project coordinator, I organized weekly meetings, tracked progress, and redistributed responsibilities when some tasks fell behind. This helped the team complete the research within the planned timeline and produce a clear final presentation. The experience strengthened my ability to manage a team, solve problems, communicate clearly, and keep people focused on a shared objective.";

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
        "Leadership Valley progress:",
        leadership?.progress + "%"
    );

    console.log(
        "Leadership Valley status:",
        leadership?.status
    );

    const evidenceCheckpoint =
        leadership?.checkpoints?.find(
            checkpoint =>
                checkpoint.id === "leadership-evidence"
        );

    console.log(
        "Leadership Evidence progress:",
        evidenceCheckpoint?.progress + "%"
    );

    console.log("\nTasks:");

    for (
        const checkpoint
        of leadership?.checkpoints || []
    ) {

        for (
            const task
            of checkpoint.tasks || []
        ) {

            console.log(
                `• ${task.id} | completed=${task.completed}`
            );

        }

    }

    console.log("\n======================================");
    console.log("LEADERSHIP IMPACT TEST COMPLETE");
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