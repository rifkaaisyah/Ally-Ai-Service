const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

/*
 * APPLICATION CV TASK TEST
 *
 * This test continues the existing journey.
 *
 * Leadership Valley:
 * completed
 *
 * Essay Valley:
 * completed
 *
 * Application Valley:
 * current
 *
 * We will:
 *
 * 1. Load the existing journey
 * 2. Confirm Application Valley is current
 * 3. Find application-cv
 * 4. Submit a realistic CV-related answer
 * 5. Check AI evaluation
 * 6. Check task completion
 * 7. Check Application Valley progress
 * 8. Confirm Leadership and Essay remain completed
 * 9. Verify persistence
 */

function printValleySummary(journey) {

    console.log("\n--- JOURNEY STATUS ---");

    console.log(
        "Scholarship:",
        journey.scholarship?.name
    );

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    for (
        const valley
        of journey.valleys || []
    ) {

        console.log(
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}% | completed=${valley.completed}`
        );

        for (
            const checkpoint
            of valley.checkpoints || []
        ) {

            console.log(
                `${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
            );

            for (
                const task
                of checkpoint.tasks || []
            ) {

                console.log(
                    `• ${task.id} | completed=${task.completed}`
                );

            }

        }

    }

}


function findTask(journey, taskId) {

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


async function run() {

    console.log(
        "======================================"
    );

    console.log(
        "APPLICATION CV TEST"
    );

    console.log(
        "======================================"
    );


    /*
     * --------------------------------------------------
     * 1. LOAD EXISTING JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n1. Loading existing journey..."
    );


    const getResponse =
        await axios.get(
            `${BASE_URL}/api/journey/${studentId}`
        );


    console.log(
        "GET status:",
        getResponse.status
    );


    console.log(
        "Journey loaded:",
        getResponse.data.success
    );


    const journey =
        getResponse.data.journey;


    printValleySummary(
        journey
    );


    /*
     * --------------------------------------------------
     * 2. CHECK APPLICATION VALLEY
     * --------------------------------------------------
     */

    const applicationValley =
        journey.valleys.find(
            valley =>
                valley.id === "application-valley"
        );


    if (!applicationValley) {

        throw new Error(
            "Application Valley was not found"
        );

    }


    console.log(
        "\n2. Current Application Valley..."
    );


    console.log({
        status:
            applicationValley.status,

        progress:
            applicationValley.progress,

        completed:
            applicationValley.completed
    });


    if (
        applicationValley.status !== "current"
    ) {

        throw new Error(
            `Application Valley is not current. Current status: ${applicationValley.status}`
        );

    }


    /*
     * --------------------------------------------------
     * 3. FIND APPLICATION CV TASK
     * --------------------------------------------------
     */

    const selectedTask =
        findTask(
            journey,
            "application-cv"
        );


    if (!selectedTask) {

        throw new Error(
            "application-cv task was not found"
        );

    }


    console.log(
        "\n3. Finding Application CV task..."
    );


    console.log(
        "Task ID:",
        selectedTask.id
    );


    console.log(
        "Task:",
        selectedTask.title
    );


    console.log(
        "Description:",
        selectedTask.description
    );


    console.log(
        "Completed:",
        selectedTask.completed
    );


    if (
        selectedTask.completed
    ) {

        throw new Error(
            "application-cv is already completed"
        );

    }


    /*
     * --------------------------------------------------
     * 4. SUBMIT APPLICATION CV ANSWER
     * --------------------------------------------------
     *
     * The answer describes the student's CV
     * preparation and focuses on:
     *
     * - relevant experience
     * - leadership
     * - research
     * - measurable achievements
     * - scholarship relevance
     *
     * This should give the AI enough evidence
     * to evaluate the task successfully.
     */

    const answer =
        "I have prepared my CV to clearly highlight the academic, research, leadership, and project experiences most relevant to my scholarship application. My academic experience includes university research projects where I worked with a team to collect and analyse information, coordinate responsibilities, and maintain data quality. I have also taken leadership responsibilities by coordinating team members, assigning tasks according to individual strengths, setting deadlines, and introducing regular progress checks. In addition, I have developed skills in communication, teamwork, problem-solving, evidence-based decision making, and project coordination. I have organised these experiences in my CV so that my responsibilities and outcomes are clearly presented, with emphasis on the experiences that demonstrate my readiness for postgraduate study and future leadership. I would also tailor the CV to the scholarship requirements by keeping the information concise, relevant, and focused on evidence of academic development, leadership, and community impact.";


    console.log(
        "\n4. Submitting Application CV answer..."
    );


    const taskResponse =
        await axios.post(

            `${BASE_URL}/api/journey/task/evaluate`,

            {

                studentId,

                taskId:
                    "application-cv",

                answer

            }

        );


    console.log(
        "Task evaluation status:",
        taskResponse.status
    );


    /*
     * --------------------------------------------------
     * 5. SHOW EVALUATION
     * --------------------------------------------------
     */

    console.log(
        "\n5. Evaluation..."
    );


    console.log(
        JSON.stringify(
            taskResponse.data.evaluation,
            null,
            2
        )
    );


    /*
     * --------------------------------------------------
     * 6. SHOW UPDATED TASK
     * --------------------------------------------------
     */

    console.log(
        "\n6. Updated task..."
    );


    console.log(
        JSON.stringify(
            taskResponse.data.task,
            null,
            2
        )
    );


    /*
     * --------------------------------------------------
     * 7. SHOW UPDATED APPLICATION VALLEY
     * --------------------------------------------------
     */

    const updatedJourney =
        taskResponse.data.journey;


    const updatedApplicationValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "application-valley"
        );


    console.log(
        "\n7. Updated Application Valley..."
    );


    console.log({
        status:
            updatedApplicationValley.status,

        progress:
            updatedApplicationValley.progress,

        completed:
            updatedApplicationValley.completed
    });


    /*
     * --------------------------------------------------
     * 8. VERIFY PREVIOUS VALLEYS
     * --------------------------------------------------
     */

    const updatedLeadershipValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "leadership-valley"
        );


    const updatedEssayValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "essay-valley"
        );


    console.log(
        "\n8. Verify previous valleys..."
    );


    console.log(
        "Leadership Valley:",
        {
            status:
                updatedLeadershipValley.status,

            progress:
                updatedLeadershipValley.progress,

            completed:
                updatedLeadershipValley.completed
        }
    );


    console.log(
        "Essay Valley:",
        {
            status:
                updatedEssayValley.status,

            progress:
                updatedEssayValley.progress,

            completed:
                updatedEssayValley.completed
        }
    );


    /*
     * --------------------------------------------------
     * 9. VERIFY PERSISTENCE
     * --------------------------------------------------
     */

    console.log(
        "\n9. Loading journey again to verify persistence..."
    );


    const persistedResponse =
        await axios.get(
            `${BASE_URL}/api/journey/${studentId}`
        );


    console.log(
        "GET status:",
        persistedResponse.status
    );


    const persistedJourney =
        persistedResponse.data.journey;


    const persistedApplicationCv =
        findTask(
            persistedJourney,
            "application-cv"
        );


    console.log(
        "\nPersisted Application CV task:"
    );


    console.log(
        JSON.stringify(
            persistedApplicationCv,
            null,
            2
        )
    );


    /*
     * --------------------------------------------------
     * 10. FINAL RESULT
     * --------------------------------------------------
     */

    console.log(
        "\n======================================"
    );


    if (
        persistedApplicationCv &&
        persistedApplicationCv.completed === true
    ) {

        console.log(
            "SUCCESS: application-cv is completed and persisted."
        );

    }
    else {

        console.log(
            "TASK NOT COMPLETED."
        );

        console.log(
            "Use the AI evaluation feedback above to improve the answer and retry."
        );

    }


    console.log(
        "======================================"
    );

}


run()
.catch(error => {

    console.error(
        "\nTEST FAILED"
    );


    if (
        error.response
    ) {

        console.error(
            "Status:",
            error.response.status
        );

        console.error(
            "Response:",
            error.response.data
        );

    }
    else {

        console.error(
            error.message
        );

    }

});