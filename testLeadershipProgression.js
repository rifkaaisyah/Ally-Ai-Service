const axios = require("axios");

const BASE_URL = "http://localhost:3001";

// Use a NEW student ID each time you want a fresh journey.
const studentId = "student-leadership-flow-001";

const scholarship = {
    id: "chevening-001",
    name: "Chevening Scholarship",
    deadline: {
        application_period: "2026-11-04"
    }
};

/*
 * Simulated Assessment 2 data.
 *
 * We intentionally use strong leadership-related
 * answers so the generated journey has leadership
 * as the current valley.
 */
const answers = {

    q1_why_do_you_want_to_pursue_this_masters_degree:
        "I want to pursue a Master's degree to develop advanced expertise and create meaningful impact in my community.",

    q2_master_motivation:
        "I want to strengthen my academic and professional skills so I can contribute to education and community development.",

    q3_master_plan_clarity:
        "Very Clear",

    q4_academic_experience:
        "research experience",

    q5_academic_achievement_description:
        "I have completed academic projects and research activities involving data collection, analysis and presentation.",

    q6_field_project_experience:
        "multiple projects",

    q7_leadership_experience:
        "I have led student research projects and coordinated project teams.",

    q8_leadership_responsibility:
        "I coordinated a student research project, divided responsibilities among team members, monitored progress and organized the final presentation.",

    q9_leadership_impact:
        "The project involved multiple students and was completed successfully with clear findings and a final presentation.",

    q10_career_goal:
        "I want to build a career in my field and contribute to education and community development.",

    q11_career_contribution_area:
        "education and community development",

    q12_target_countries:
        "United Kingdom",

    q13_scholarship_type:
        "fully funded",

    q14_scholarship_priority:
        "High",

    q15_cv_strength:
        "Good",

    q16_essay_readiness:
        "Draft Ready",

    q17_recommendation_availability:
        "Available",

    q18_preparation_time:
        "More than 1 year",

    q19_application_deadline_target:
        "2026"
};


/*
 * Answers for the leadership tasks.
 *
 * These are deliberately specific so we can test
 * whether the AI evaluator marks the tasks complete.
 */
const leadershipAnswers = {

    "leadership-activities":
        "I led a student research project involving a team of 4 students. I coordinated the research activities, divided responsibilities, monitored progress and organized the final presentation. The project was completed successfully and produced findings that we presented to our academic community.",

    "leadership-role":
        "I served as the project coordinator and team leader. I assigned responsibilities based on each member's strengths, organized meetings, tracked deadlines, supported team members when they faced difficulties, and coordinated the final presentation.",

    "leadership-impact":
        "My leadership helped the team stay organized and complete the research project on schedule. We successfully completed the research, analyzed the findings and presented the results. The experience strengthened our teamwork and gave me practical experience managing a small project team.",

    "leadership-star":
        "Situation: I was part of a student research project that required several students to work together under a deadline. Task: I took responsibility for coordinating the team and making sure the project progressed smoothly. Action: I divided the research tasks, organized meetings, monitored progress, helped resolve problems and coordinated the final presentation. Result: We completed the research successfully and presented our findings to our academic community.",

    "leadership-lesson":
        "This experience taught me that effective leadership requires clear communication, delegation, accountability and support for team members. I learned that a good leader does not simply give instructions but helps the team understand its goals, overcome challenges and work together toward a successful outcome."
};


/*
 * Print the current journey.
 */
function printJourney(journey) {

    console.log("\n--------------------------------------");
    console.log("JOURNEY STATUS");
    console.log("--------------------------------------");

    console.log(
        "Scholarship:",
        journey.scholarship?.name
    );

    console.log(
        "Readiness:",
        journey.readiness + "%"
    );

    console.log(
        "Strategy:",
        journey.strategy
    );

    for (const valley of journey.valleys || []) {

        console.log(
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}%`
        );

        for (const checkpoint of valley.checkpoints || []) {

            console.log(
                `${checkpoint.title} | progress=${checkpoint.progress}%`
            );

            for (const task of checkpoint.tasks || []) {

                console.log(
                    `  • ${task.id} | completed=${task.completed}`
                );

            }
        }
    }
}


/*
 * Find the first incomplete task
 * inside the current valley.
 */
function findCurrentTask(journey) {

    for (const valley of journey.valleys || []) {

        if (valley.status !== "current") {
            continue;
        }

        for (const checkpoint of valley.checkpoints || []) {

            for (const task of checkpoint.tasks || []) {

                if (!task.completed) {
                    return task;
                }

            }
        }
    }

    return null;
}


/*
 * Submit one task.
 */
async function submitTask(task) {

    const answer =
        leadershipAnswers[task.id];

    if (!answer) {

        throw new Error(
            `No test answer defined for task: ${task.id}`
        );

    }

    console.log("\n======================================");
    console.log("SUBMITTING TASK");
    console.log("======================================");

    console.log(
        "Task ID:",
        task.id
    );

    console.log(
        "Task:",
        task.title
    );

    const response =
        await axios.post(

            `${BASE_URL}/api/journey/task/evaluate`,

            {
                studentId,

                taskId:
                    task.id,

                answer
            }

        );

    console.log(
        "Status:",
        response.status
    );

    console.log(
        "\nEvaluation:"
    );

    console.log(
        JSON.stringify(
            response.data.evaluation,
            null,
            2
        )
    );

    console.log(
        "\nUpdated task:"
    );

    console.log(
        JSON.stringify(
            response.data.task,
            null,
            2
        )
    );

    return response.data.journey;
}


/*
 * Main test.
 */
async function run() {

    console.log(
        "======================================"
    );

    console.log(
        "LEADERSHIP JOURNEY PROGRESSION TEST"
    );

    console.log(
        "======================================"
    );


    /*
     * --------------------------------------
     * 1. CREATE JOURNEY
     * --------------------------------------
     */

    console.log(
        "\n1. Creating journey..."
    );

    console.log(
        "Student ID:",
        studentId
    );

    const createResponse =
        await axios.post(

            `${BASE_URL}/api/journey`,

            {
                studentId,

                answers,

                uploads: {},

                scholarship
            }

        );

    console.log(
        "Create status:",
        createResponse.status
    );

    console.log(
        "Journey created:",
        createResponse.data.success
    );

    let journey =
        createResponse.data.journey;

    printJourney(journey);


    /*
     * --------------------------------------
     * 2. LOAD JOURNEY
     * --------------------------------------
     */

    console.log(
        "\n2. Loading saved journey..."
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

    journey =
        getResponse.data.journey;


    /*
     * --------------------------------------
     * 3. COMPLETE LEADERSHIP TASKS
     * --------------------------------------
     */

    console.log(
        "\n3. Beginning leadership progression..."
    );

    /*
     * We expect exactly these five tasks
     * to be completed.
     */

    const expectedTasks = [
        "leadership-activities",
        "leadership-role",
        "leadership-impact",
        "leadership-star",
        "leadership-lesson"
    ];


    for (
        let i = 0;
        i < expectedTasks.length;
        i++
    ) {

        const currentTask =
            findCurrentTask(journey);


        if (!currentTask) {

            console.log(
                "\nNo incomplete task found."
            );

            break;

        }


        console.log(
            `\nNext task (${i + 1}/${expectedTasks.length}):`,
            currentTask.id
        );


        /*
         * Make sure the roadmap is actually
         * selecting the expected task.
         */

        if (
            currentTask.id !==
            expectedTasks[i]
        ) {

            console.warn(
                `WARNING: Expected ${expectedTasks[i]} but roadmap selected ${currentTask.id}`
            );

        }


        journey =
            await submitTask(
                currentTask
            );


        printJourney(journey);


        /*
         * Stop if AI did not allow completion.
         *
         * This makes the test clearly show
         * which task failed.
         */

        const updatedTask =
            journey.valleys
                ?.flatMap(
                    valley =>
                        valley.checkpoints || []
                )
                .flatMap(
                    checkpoint =>
                        checkpoint.tasks || []
                )
                .find(
                    task =>
                        task.id === currentTask.id
                );


        if (
            !updatedTask?.completed
        ) {

            console.log(
                "\nTASK NOT COMPLETED."
            );

            console.log(
                "The AI evaluator requires more evidence."
            );

            break;

        }

    }


    /*
     * --------------------------------------
     * 4. VERIFY LEADERSHIP PROGRESS
     * --------------------------------------
     */

    console.log(
        "\n4. Checking leadership progress..."
    );

    const finalResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );

    journey =
        finalResponse.data.journey;

    printJourney(journey);


    /*
     * Count completed leadership tasks.
     */

    let completedLeadershipTasks = 0;

    for (const valley of journey.valleys || []) {

        if (
            valley.name !==
            "Leadership Valley"
        ) {
            continue;
        }

        for (const checkpoint of valley.checkpoints || []) {

            for (const task of checkpoint.tasks || []) {

                if (task.completed) {

                    completedLeadershipTasks++;

                }

            }
        }
    }


    console.log(
        "\nCompleted leadership tasks:",
        completedLeadershipTasks,
        "/ 5"
    );


    /*
     * --------------------------------------
     * 5. CHECK WHETHER ESSAY UNLOCKED
     * --------------------------------------
     */

    console.log(
        "\n5. Checking Essay Valley unlock..."
    );


    const essayValley =
        (journey.valleys || []).find(
            valley =>
                valley.name ===
                "Essay Valley"
        );


    if (!essayValley) {

        console.log(
            "WARNING: Essay Valley not found."
        );

    }
    else {

        console.log(
            "Essay Valley status:",
            essayValley.status
        );

        console.log(
            "Essay Valley progress:",
            essayValley.progress + "%"
        );

    }


    /*
     * --------------------------------------
     * 6. FINAL RESULT
     * --------------------------------------
     */

    console.log(
        "\n======================================"
    );

    console.log(
        "LEADERSHIP FLOW TEST RESULT"
    );

    console.log(
        "======================================"
    );

    console.log(
        "Leadership tasks completed:",
        completedLeadershipTasks,
        "/ 5"
    );

    console.log(
        "Essay Valley:",
        essayValley?.status || "unknown"
    );


    if (
        completedLeadershipTasks === 5
    ) {

        console.log(
            "\nSUCCESS: All leadership tasks completed."
        );

        if (
            essayValley?.status ===
            "current"
        ) {

            console.log(
                "SUCCESS: Essay Valley is now unlocked."
            );

        }
        else {

            console.log(
                "NOTE: Leadership tasks are complete, but Essay Valley did not become current."
            );

        }

    }
    else {

        console.log(
            "\nLeadership flow is not complete yet."
        );

        console.log(
            "Use the evaluation feedback above to identify the task that needs work."
        );

    }


    console.log(
        "\n======================================"
    );

    console.log(
        "TEST COMPLETE"
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