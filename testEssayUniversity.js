const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

/*
 * =========================================================
 * ESSAY UNIVERSITY TASK TEST
 * =========================================================
 *
 * This test:
 *
 * 1. Loads the student's existing journey
 * 2. Finds essay-university
 * 3. Submits an answer
 * 4. Checks the AI evaluation
 * 5. Checks that the task becomes completed
 * 6. Checks Essay Valley progress
 * 7. Loads the journey again
 * 8. Verifies persistence
 *
 * =========================================================
 */


/*
 * ---------------------------------------------------------
 * Find a task anywhere inside the journey
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
 * Find a valley
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
        "ESSAY UNIVERSITY TASK TEST"
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
     * 3. FIND essay-university
     * -----------------------------------------------------
     */

    console.log(
        "\n3. Finding Essay University task..."
    );


    const task =
        findTask(
            journey,
            "essay-university"
        );


    if (!task) {

        throw new Error(
            "Task essay-university was not found"
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
     * 4. SAFETY CHECK
     * -----------------------------------------------------
     */

    if (
        task.completed
    ) {

        console.log(
            "\nWARNING: essay-university is already completed."
        );

        console.log(
            "The test will submit it again to verify the API still handles it."
        );

    }


    /*
     * -----------------------------------------------------
     * 5. SUBMIT UNIVERSITY ANSWER
     * -----------------------------------------------------
     */

    console.log(
        "\n4. Submitting university essay answer..."
    );


    const answer =
        "I want to study at a university that combines strong academic teaching with practical learning, research and an international environment. I am particularly interested in a programme that will allow me to strengthen my expertise while learning from academics and students with different perspectives. The university's academic resources, research opportunities and connections with professionals would help me develop the knowledge and skills needed for my long-term career goals. Studying in the United Kingdom would also expose me to new approaches and ideas that I can apply to education and community development in my own context. I hope to use the knowledge, networks and experience gained during my Master's degree to contribute meaningfully to my field and community.";


    const taskResponse =
        await axios.post(

            `${BASE_URL}/api/journey/task/evaluate`,

            {

                studentId,

                taskId:
                    "essay-university",

                answer

            }

        );


    console.log(
        "Task evaluation status:",
        taskResponse.status
    );


    /*
     * -----------------------------------------------------
     * 6. SHOW EVALUATION
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
     * 7. SHOW UPDATED TASK
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
     * 8. SHOW UPDATED ESSAY VALLEY
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
     * 9. CHECK APPLICATION VALLEY
     * -----------------------------------------------------
     */

    console.log(
        "\n6. Application Valley..."
    );


    const application =
        findValley(
            updatedJourney,
            "application-valley"
        );


    if (application) {

        console.log(
            {
                status:
                    application.status,

                progress:
                    application.progress,

                completed:
                    application.completed
            }
        );

    }


    /*
     * -----------------------------------------------------
     * 10. LOAD JOURNEY AGAIN
     * -----------------------------------------------------
     *
     * This proves that the updated task
     * was actually saved.
     * -----------------------------------------------------
     */

    console.log(
        "\n7. Loading journey again to verify persistence..."
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
            "essay-university"
        );


    console.log(
        "\nPersisted Essay University task:"
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
     * 11. FINAL CHECK
     * -----------------------------------------------------
     */

    console.log(
        "\n8. Final result..."
    );


    if (
        persistedTask &&
        persistedTask.completed === true
    ) {

        console.log(
            "SUCCESS: essay-university is completed and persisted."
        );

    }
    else {

        console.log(
            "essay-university is NOT completed yet."
        );

        console.log(
            "Use the AI evaluation feedback to improve the answer and retry."
        );

    }


    console.log(
        "\n======================================"
    );

    console.log(
        "ESSAY UNIVERSITY TEST COMPLETE"
    );

    console.log(
        "======================================"
    );

}


/*
 * ---------------------------------------------------------
 * Run
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