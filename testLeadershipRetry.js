const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

async function run() {
    console.log("======================================");
    console.log("LEADERSHIP TASK RETRY TEST");
    console.log("======================================");

    /*
     * Retry the task that previously failed.
     */
    const taskId = "leadership-role";

    console.log("\n1. Retrying failed task...");
    console.log("Task ID:", taskId);

    /*
     * This answer is intentionally much more specific.
     */
    const answer =
        "I served as the coordinator for a university research project involving a team of 5 students. I divided responsibilities among team members, organized weekly meetings, monitored our progress, and coordinated the collection and analysis of research data. When the team faced difficulties with the data collection process, I adjusted the project timeline and reassigned responsibilities so we could stay on track. I also coordinated the final presentation and made sure each team member contributed to the results. Through this role, I demonstrated leadership, communication, delegation, problem-solving, and accountability.";

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

    console.log("\nUpdated journey:");

    const journey =
        response.data.journey;

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    console.log(
        "Leadership Valley:",
        journey.valleys?.find(
            valley =>
                valley.name === "Leadership Valley"
        )
    );

    console.log("\n======================================");
    console.log("RETRY TEST COMPLETE");
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