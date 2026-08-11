const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

/*
 * This test assumes the leadership progression journey
 * already exists for this student.
 *
 * We will:
 * 1. Load the journey
 * 2. Find leadership-lesson
 * 3. Submit a strong answer
 * 4. Check AI evaluation
 * 5. Check Leadership Valley progress
 * 6. Check whether Essay Valley unlocks
 */

function printSummary(journey) {
    console.log("\n--- JOURNEY SUMMARY ---");

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    for (const valley of journey.valleys || []) {

        console.log(
            `${valley.name} | status=${valley.status} | progress=${valley.progress}%`
        );

        for (const checkpoint of valley.checkpoints || []) {

            console.log(
                `  ${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
            );

            for (const task of checkpoint.tasks || []) {

                console.log(
                    `    • ${task.id} | completed=${task.completed}`
                );

            }
        }
    }
}

async function run() {

    console.log(
        "======================================"
    );

    console.log(
        "LEADERSHIP LESSON TEST"
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

    const getResponse = await axios.get(
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


    printSummary(journey);


    /*
     * --------------------------------------------------
     * 2. FIND LEADERSHIP LESSON TASK
     * --------------------------------------------------
     */

    let selectedTask = null;

    for (const valley of journey.valleys || []) {

        for (const checkpoint of valley.checkpoints || []) {

            for (const task of checkpoint.tasks || []) {

                if (
                    task.id === "leadership-lesson"
                ) {

                    selectedTask = task;

                }

            }
        }
    }


    if (!selectedTask) {

        throw new Error(
            "leadership-lesson task was not found"
        );

    }


    console.log(
        "\n2. Leadership lesson task found:"
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
        "Completed:",
        selectedTask.completed
    );


    /*
     * --------------------------------------------------
     * 3. SUBMIT STRONG ANSWER
     * --------------------------------------------------
     */

    console.log(
        "\n3. Submitting leadership lesson..."
    );


    const answer =
        "One of the most important lessons I learned from leading a university research project was that effective leadership requires clear communication, delegation, and adaptability. At the beginning of the project, I tried to manage too many responsibilities myself. I realized that this slowed progress and made it harder for other team members to contribute effectively. I changed my approach by assigning responsibilities according to each member's strengths, setting clear deadlines, and creating regular check-ins to identify problems early. This improved coordination and helped the team complete the research project successfully. The experience taught me that a good leader does not simply give instructions; they create an environment where team members can contribute, solve problems, and take ownership of their responsibilities. Since then, I have become more confident in delegating tasks, communicating expectations, and adapting my leadership style to the needs of the team.";


    const taskResponse =
        await axios.post(

            `${BASE_URL}/api/journey/task/evaluate`,

            {
                studentId,

                taskId:
                    selectedTask.id,

                answer
            }

        );


    console.log(
        "Task evaluation status:",
        taskResponse.status
    );


    /*
     * --------------------------------------------------
     * 4. SHOW AI EVALUATION
     * --------------------------------------------------
     */

    console.log(
        "\nEvaluation:"
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
     * 5. SHOW UPDATED TASK
     * --------------------------------------------------
     */

    console.log(
        "\nUpdated task:"
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
     * 6. SHOW UPDATED JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n4. Updated journey:"
    );

    printSummary(
        taskResponse.data.journey
    );


    /*
     * --------------------------------------------------
     * 7. CHECK LEADERSHIP VALLEY
     * --------------------------------------------------
     */

    const updatedJourney =
        taskResponse.data.journey;


    const leadershipValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "leadership-valley"
        );


    console.log(
        "\n5. Leadership Valley result:"
    );


    if (leadershipValley) {

        console.log({
            status:
                leadershipValley.status,

            progress:
                leadershipValley.progress,

            completed:
                leadershipValley.completed
        });

    }


    /*
     * --------------------------------------------------
     * 8. CHECK ESSAY VALLEY
     * --------------------------------------------------
     */

    const essayValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "essay-valley"
        );


    console.log(
        "\n6. Essay Valley result:"
    );


    if (essayValley) {

        console.log({
            status:
                essayValley.status,

            progress:
                essayValley.progress,

            completed:
                essayValley.completed
        });

    }


    /*
     * --------------------------------------------------
     * 9. VERIFY PERSISTENCE
     * --------------------------------------------------
     */

    console.log(
        "\n7. Loading journey again to verify persistence..."
    );


    const persistedResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );


    const persistedJourney =
        persistedResponse.data.journey;


    let persistedLesson = null;


    for (
        const valley
        of persistedJourney.valleys || []
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
                    task.id === "leadership-lesson"
                ) {

                    persistedLesson = task;

                }

            }

        }

    }


    console.log(
        "\nPersisted leadership lesson:"
    );

    console.log(
        JSON.stringify(
            persistedLesson,
            null,
            2
        )
    );


    /*
     * --------------------------------------------------
     * FINAL RESULT
     * --------------------------------------------------
     */

    console.log(
        "\n======================================"
    );

    console.log(
        "LEADERSHIP LESSON TEST COMPLETE"
    );

    console.log(
        "======================================"
    );

}

run()
.catch(error => {

    console.error(
        "\nTEST FAILED"
    );


    if (error.response) {

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