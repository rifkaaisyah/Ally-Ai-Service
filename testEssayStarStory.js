const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

/*
 * =========================================================
 * ESSAY STAR STORY TASK TEST
 * =========================================================
 *
 * This test:
 *
 * 1. Loads the existing journey
 * 2. Finds essay-star-story
 * 3. Submits a STAR-based essay answer
 * 4. Checks AI evaluation
 * 5. Checks task completion
 * 6. Checks Essay Valley progress
 * 7. Verifies persistence
 *
 * =========================================================
 */


/*
 * ---------------------------------------------------------
 * Find task by ID
 * ---------------------------------------------------------
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
 * ---------------------------------------------------------
 * Find valley by ID
 * ---------------------------------------------------------
 */

function findValley(
    journey,
    valleyId
) {

    return (
        journey.valleys || []
    ).find(
        valley =>
            valley.id === valleyId
    );

}


/*
 * ---------------------------------------------------------
 * Print Essay Valley
 * ---------------------------------------------------------
 */

function printEssayValley(
    journey
) {

    const essay =
        findValley(
            journey,
            "essay-valley"
        );


    if (!essay) {

        console.log(
            "Essay Valley not found"
        );

        return;

    }


    console.log(
        "\nEssay Valley:"
    );


    console.log(
        {
            status:
                essay.status,

            progress:
                essay.progress,

            completed:
                essay.completed
        }
    );


    for (
        const checkpoint
        of essay.checkpoints || []
    ) {

        console.log(
            `\n${checkpoint.title} | progress=${checkpoint.progress}% | completed=${checkpoint.completed}`
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


/*
 * ---------------------------------------------------------
 * Main test
 * ---------------------------------------------------------
 */

async function run() {

    console.log(
        "======================================"
    );

    console.log(
        "ESSAY STAR STORY TEST"
    );

    console.log(
        "======================================"
    );


    /*
     * -----------------------------------------------------
     * 1. LOAD EXISTING JOURNEY
     * -----------------------------------------------------
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


    const journey =
        getResponse.data.journey;


    if (!journey) {

        throw new Error(
            "Journey not found"
        );

    }


    console.log(
        "Journey loaded:",
        getResponse.data.success
    );


    /*
     * -----------------------------------------------------
     * 2. SHOW CURRENT ESSAY PROGRESS
     * -----------------------------------------------------
     */

    console.log(
        "\n2. Current Essay Valley..."
    );


    printEssayValley(
        journey
    );


    /*
     * -----------------------------------------------------
     * 3. FIND ESSAY STAR STORY TASK
     * -----------------------------------------------------
     */

    console.log(
        "\n3. Finding Essay STAR Story task..."
    );


    const task =
        findTask(
            journey,
            "essay-star-story"
        );


    if (!task) {

        throw new Error(
            "Task essay-star-story was not found"
        );

    }


    console.log(
        "Task ID:",
        task.id
    );


    console.log(
        "Task:",
        task.title
    );


    console.log(
        "Description:",
        task.description
    );


    console.log(
        "Completed:",
        task.completed
    );


    /*
     * -----------------------------------------------------
     * 4. SUBMIT STAR STORY
     * -----------------------------------------------------
     */

    console.log(
        "\n4. Submitting Essay STAR story..."
    );


    const answer =
        "Situation: During an academic research project, I worked with a small student team that needed to collect and analyze information within a limited timeframe. The project required us to organize our responsibilities carefully so that we could produce reliable findings.\n\n" +
        "Task: I took responsibility for coordinating the team's work, making sure that everyone understood their responsibilities and that our research activities stayed on schedule.\n\n" +
        "Action: I divided the research activities among team members based on their strengths, coordinated our data collection, checked our progress regularly and helped resolve problems when they arose. I also encouraged the team to communicate openly so that issues could be addressed early.\n\n" +
        "Result: We successfully completed the research project and produced the required findings on time. The experience strengthened my ability to coordinate people, communicate clearly, solve problems and take responsibility for achieving a shared goal.";


    const taskResponse =
        await axios.post(

            `${BASE_URL}/api/journey/task/evaluate`,

            {

                studentId,

                taskId:
                    "essay-star-story",

                answer

            }

        );


    console.log(
        "Task evaluation status:",
        taskResponse.status
    );


    /*
     * -----------------------------------------------------
     * 5. SHOW EVALUATION
     * -----------------------------------------------------
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
     * -----------------------------------------------------
     * 6. SHOW UPDATED TASK
     * -----------------------------------------------------
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
     * -----------------------------------------------------
     * 7. SHOW UPDATED JOURNEY
     * -----------------------------------------------------
     */

    console.log(
        "\n5. Updated Essay Valley..."
    );


    const updatedJourney =
        taskResponse.data.journey;


    printEssayValley(
        updatedJourney
    );


    /*
     * -----------------------------------------------------
     * 8. CHECK ESSAY VALLEY
     * -----------------------------------------------------
     */

    const updatedEssay =
        findValley(
            updatedJourney,
            "essay-valley"
        );


    console.log(
        "\n6. Essay Valley result:"
    );


    console.log(
        {
            status:
                updatedEssay?.status,

            progress:
                updatedEssay?.progress,

            completed:
                updatedEssay?.completed
        }
    );


    /*
     * -----------------------------------------------------
     * 9. CHECK APPLICATION VALLEY
     * -----------------------------------------------------
     */

    const application =
        findValley(
            updatedJourney,
            "application-valley"
        );


    console.log(
        "\n7. Application Valley:"
    );


    console.log(
        {
            status:
                application?.status,

            progress:
                application?.progress,

            completed:
                application?.completed
        }
    );


    /*
     * -----------------------------------------------------
     * 10. VERIFY PERSISTENCE
     * -----------------------------------------------------
     */

    console.log(
        "\n8. Loading journey again to verify persistence..."
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


    const persistedTask =
        findTask(
            persistedJourney,
            "essay-star-story"
        );


    console.log(
        "\nPersisted Essay STAR Story task:"
    );


    console.log(
        JSON.stringify(
            persistedTask,
            null,
            2
        )
    );


    /*
     * -----------------------------------------------------
     * 11. FINAL RESULT
     * -----------------------------------------------------
     */

    console.log(
        "\n9. Final result..."
    );


    if (
        persistedTask &&
        persistedTask.completed === true
    ) {

        console.log(
            "SUCCESS: essay-star-story is completed and persisted."
        );

    }
    else {

        console.log(
            "essay-star-story is NOT completed yet."
        );

        console.log(
            "Use the AI feedback above to improve the answer and retry."
        );

    }


    console.log(
        "\n======================================"
    );

    console.log(
        "ESSAY STAR STORY TEST COMPLETE"
    );

    console.log(
        "======================================"
    );

}


/*
 * ---------------------------------------------------------
 * Run test
 * ---------------------------------------------------------
 */

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