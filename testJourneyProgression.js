const axios = require("axios");

const BASE_URL = "http://localhost:3001";

/*
=================================================
REAL JOURNEY PROGRESSION TEST
=================================================

IMPORTANT:

Use a completely NEW student ID.

This test verifies:

Research
↓
Leadership
↓
Essay
↓
Application

It uses the REAL API endpoints.

It also verifies persistence after each stage.
*/

/*
=================================================
STUDENT ID
=================================================
*/

const studentId =
    "student-journey-progression-test-004";

/*
=================================================
SCHOLARSHIP
=================================================
*/

const scholarship = {

    id: "chevening-001",

    name: "Chevening Scholarship",

    deadline: {
        application_period: "2026-11-04"
    }

};

/*
=================================================
ASSESSMENT 2 ANSWERS
=================================================

No readiness is supplied.

The backend calculates it.
*/

const answers = {

    q2_master_motivation:
        "career_advancement",

    q3_master_plan_clarity:
        "exact_program_university",

    q4_academic_experience:
        [
            "research_experience"
        ],

    q5_academic_achievement_description:
        "I completed academic projects and research activities.",

    q6_field_project_experience:
        "multiple_projects",

    q7_leadership_experience:
        [
            "student_organization",
            "research_project_leadership"
        ],

    q8_leadership_responsibility:
        "I coordinated a university research project and divided responsibilities among four team members.",

    q9_leadership_impact:
        "The team completed the research project and presented the findings to our academic supervisor.",

    q10_career_goal:
        "social_impact",

    q11_career_contribution_area:
        "education and community development",

    q12_target_countries:
        [
            "uk"
        ],

    q13_scholarship_type:
        "fully_funded",

    q14_scholarship_priority:
        [
            "funding",
            "university_reputation",
            "career"
        ],

    q15_cv_strength:
        "good_needs_improvement",

    q16_essay_readiness:
        "clear_story",

    q17_recommendation_availability:
        "available",

    q18_preparation_time:
        "more_than_10_hours",

    q19_application_deadline_target:
        "within_3_months",

    q20_support_needed:
        [
            "roadmap",
            "cv_help",
            "essay_help",
            "mentor"
        ]

};

/*
=================================================
PRINT JOURNEY STATUS
=================================================
*/

function printValleyStatus(journey) {

    console.log("\nJourney status:");

    for (
        const valley
        of journey.valleys || []
    ) {

        console.log(
            `  ${valley.name} | status=${valley.status} | progress=${valley.progress}% | completed=${valley.completed}`
        );

    }

}

/*
=================================================
FIND TASK
=================================================
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

                    return {
                        task,
                        valley
                    };

                }

            }

        }

    }

    return null;

}

/*
=================================================
GET CURRENT VALLEY
=================================================
*/

function getCurrentValley(journey) {

    return (
        journey.valleys || []
    ).find(
        valley =>
            valley.status === "current"
    );

}

/*
=================================================
GET INCOMPLETE TASKS FROM A SPECIFIC VALLEY
=================================================

IMPORTANT:

This function deliberately receives a valley.

We DO NOT look up the current valley here.

Otherwise, when Research becomes completed,
Leadership becomes current and the test would
accidentally continue completing Leadership.
=================================================
*/

function getIncompleteTasksFromValley(
    valley
) {

    if (!valley) {

        return [];

    }

    const tasks = [];

    for (
        const checkpoint
        of valley.checkpoints || []
    ) {

        for (
            const task
            of checkpoint.tasks || []
        ) {

            if (
                !task.completed
            ) {

                tasks.push(task);

            }

        }

    }

    return tasks;

}

/*
=================================================
ANSWER GENERATOR
=================================================

These answers are intentionally specific enough
for the current AI evaluator.
=================================================
*/

function answerForTask(taskId) {

    const answers = {

        /*
        -----------------------------
        RESEARCH
        -----------------------------
        */

        "research-collect":
            "I participated in a university research project about education and community development. I worked with a team of four students and helped conduct research, organize information, and prepare the final presentation.",

        "research-contribution":
            "My contribution was coordinating the research timeline, dividing responsibilities among four team members, organizing weekly meetings, reviewing research materials, and helping prepare the final presentation.",

        "research-achievements":
            "I successfully completed a university research project as part of a four-person team. My achievements included contributing to the final research report, helping prepare and deliver the research presentation to our academic supervisor, and completing the project according to the agreed timeline. The project gave me concrete research and presentation experience that I can use as evidence of my academic development.",

        "research-topic":
            "My research interest is focused on education and community development, particularly how educational initiatives can create measurable social impact.",

        "research-impact":
            "The project helped our team develop evidence-based recommendations and present practical findings to our academic supervisor. It strengthened my ability to connect research with real-world community impact.",

        /*
        -----------------------------
        LEADERSHIP
        -----------------------------
        */

        "leadership-activities":
            "I have two leadership experiences. First, I participated in a university student organization where I worked with other students on academic and community-related activities. Second, I led a university research project involving four students. In the research project, I coordinated the team, divided responsibilities, organized weekly meetings, managed the timeline, and helped the team complete and present the research findings to our academic supervisor.",

        "leadership-role":
            "I coordinated a university research project, divided responsibilities among team members, organized weekly meetings, and managed the project timeline.",

        "leadership-impact":
            "I coordinated four students and managed the research timeline. We completed the project successfully and presented our findings to our academic supervisor.",

        "leadership-star":
            "Situation: I led a university research project with four students. Task: I needed to coordinate the team and keep the project on schedule. Action: I divided responsibilities, organized weekly meetings, monitored progress, and helped resolve issues. Result: We completed the research project and presented our findings successfully.",

        "leadership-lesson":
            "I learned that effective leadership requires clear communication, delegation, accountability, and adapting when team members face challenges.",

        /*
        -----------------------------
        ESSAY
        -----------------------------
        */

        "essay-motivation":
            "I want to pursue a Master's degree because I want to strengthen my academic and professional expertise and use that knowledge to create meaningful impact in education and community development.",

        "essay-university":
            "I am interested in studying in the United Kingdom because of its strong academic environment, international perspective, and opportunities to develop knowledge that can contribute to my long-term career goals.",

        "essay-star-story":
            "During a university research project, I led a team of four students. I coordinated responsibilities, organized weekly meetings, managed the timeline, and supported the team in completing the research. We successfully completed the project and presented our findings to our academic supervisor.",

        "essay-impact":
            "The experience strengthened my leadership, communication, project management, and research skills. It also showed me how structured teamwork can turn an academic project into useful outcomes.",

        "essay-clarity":
            "My scholarship story connects my academic experience, leadership experience, career goals, and commitment to education and community development.",

        "essay-alignment":
            "My experiences and career goals align with a scholarship focused on leadership, professional development, international learning, and creating positive impact in my community.",

        /*
        -----------------------------
        APPLICATION
        -----------------------------
        */

        "application-cv":
            "My CV should highlight my research projects, leadership responsibilities, academic achievements, project outcomes, and measurable contributions.",

        "application-transcript":
            "I will provide my official academic transcript showing my completed coursework and academic performance.",

        "application-recommendation":
            "I will request a recommendation from an academic or professional referee who can provide specific evidence of my leadership, research ability, teamwork, and potential.",

        "application-requirements":
            "I will check the scholarship eligibility criteria, required documents, essay requirements, recommendation requirements, deadline, and submission instructions.",

        "application-proofread":
            "I will proofread the complete application for clarity, consistency, grammar, evidence, scholarship alignment, and completeness before submission.",

        "application-submit":
            "I will complete the final application review, confirm all required documents are attached, verify the deadline, and submit the application through the official scholarship application system."

    };

    return (
        answers[taskId] ||
        "I completed this task by applying my academic, research, leadership, and career experience to my scholarship preparation. I reviewed my evidence carefully and identified specific outcomes and next steps."
    );

}

/*
=================================================
SUBMIT TASK
=================================================
*/

async function submitTask(task) {

    console.log(
        `\nSubmitting task: ${task.id}`
    );

    console.log(
        `Task title: ${task.title}`
    );

    const answer =
        answerForTask(
            task.id
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
        "HTTP status:",
        response.status
    );

    const evaluation =
        response.data.evaluation;

    console.log(
        "Score:",
        evaluation?.score
    );

    console.log(
        "Status:",
        evaluation?.status
    );

    console.log(
        "Can complete:",
        evaluation?.canComplete
    );

    console.log(
        "Task completed:",
        response.data.task?.completed
    );

    if (
        evaluation?.canComplete !== true
    ) {

        throw new Error(
            `Task ${task.id} was not completed by the evaluator`
        );

    }

    if (
        response.data.task?.completed !== true
    ) {

        throw new Error(
            `Task ${task.id} evaluation succeeded but task is not marked completed`
        );

    }

    return response.data.journey;

}

/*
=================================================
VERIFY PERSISTENCE
=================================================
*/

async function verifyPersistence(
    expectedStatuses
) {

    console.log(
        "\nVerifying persistence with GET..."
    );

    const response =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );

    if (
        response.status !== 200
    ) {

        throw new Error(
            `Expected GET 200 but received ${response.status}`
        );

    }

    const journey =
        response.data.journey;

    for (
        const expected
        of expectedStatuses
    ) {

        const valley =
            journey.valleys.find(
                item =>
                    item.name ===
                    expected.name
            );

        if (!valley) {

            throw new Error(
                `Valley not found: ${expected.name}`
            );

        }

        if (
            valley.status !==
            expected.status
        ) {

            throw new Error(
                `${expected.name} expected status ${expected.status} but got ${valley.status}`
            );

        }

    }

    console.log(
        "✓ Persistence verified"
    );

    printValleyStatus(
        journey
    );

    return journey;

}

/*
=================================================
COMPLETE ONE SPECIFIC VALLEY
=================================================

THIS IS THE IMPORTANT FIX.

We capture the valley at the beginning.

Then we ONLY submit incomplete tasks belonging
to that valley.

When the valley becomes completed, the backend
may unlock the next valley.

We DO NOT follow the newly unlocked valley.

Therefore:

complete Research
→ stop

Then verify Leadership is current.

Then:

complete Leadership
→ stop

And so on.
=================================================
*/

async function completeCurrentValley() {

    /*
     * Get fresh journey.
     */

    let response =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );

    let journey =
        response.data.journey;

    /*
     * Capture the current valley NOW.
     */

    const targetValley =
        getCurrentValley(
            journey
        );

    if (!targetValley) {

        throw new Error(
            "No current valley found"
        );

    }

    /*
     * IMPORTANT:
     *
     * Store the valley ID/name.
     *
     * We will continue working ONLY on this
     * valley even after the backend unlocks
     * the next valley.
     */

    const targetValleyId =
        targetValley.id;

    const targetValleyName =
        targetValley.name;

    console.log(
        "\n======================================"
    );

    console.log(
        `CURRENT VALLEY: ${targetValleyName}`
    );

    console.log(
        "======================================"
    );

    let safetyCounter = 0;

    while (true) {

        safetyCounter += 1;

        if (
            safetyCounter > 30
        ) {

            throw new Error(
                "Safety limit reached while completing valley"
            );

        }

        /*
         * Find the SAME valley from the latest
         * journey response.
         */

        const latestTargetValley =
            (
                journey.valleys || []
            ).find(
                valley =>
                    valley.id ===
                    targetValleyId
            );

        if (!latestTargetValley) {

            throw new Error(
                `Could not find target valley ${targetValleyName}`
            );

        }

        /*
         * Get incomplete tasks ONLY from the
         * target valley.
         */

        const incompleteTasks =
            getIncompleteTasksFromValley(
                latestTargetValley
            );

        /*
         * If there are no incomplete tasks,
         * this valley is finished.
         */

        if (
            incompleteTasks.length === 0
        ) {

            break;

        }

        /*
         * Always submit the first incomplete
         * task belonging to THIS valley.
         */

        const task =
            incompleteTasks[0];

        journey =
            await submitTask(
                task
            );

    }

    /*
     * Reload from the API.
     */

    const finalResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );

    journey =
        finalResponse.data.journey;

    /*
     * Find the target valley again.
     */

    const completedValley =
        journey.valleys.find(
            valley =>
                valley.id ===
                targetValleyId
        );

    if (
        !completedValley
    ) {

        throw new Error(
            `Could not find completed valley ${targetValleyName}`
        );

    }

    console.log(
        `\n${targetValleyName} FINAL STATUS:`,
        completedValley.status
    );

    console.log(
        `${targetValleyName} FINAL PROGRESS:`,
        completedValley.progress + "%"
    );

    if (
        completedValley.status !==
        "completed"
    ) {

        throw new Error(
            `${targetValleyName} did not become completed`
        );

    }

    if (
        completedValley.progress !==
        100
    ) {

        throw new Error(
            `${targetValleyName} did not reach 100%`
        );

    }

    return journey;

}

/*
=================================================
MAIN TEST
=================================================
*/

async function run() {

    console.log(
        "======================================"
    );

    console.log(
        "REAL JOURNEY PROGRESSION TEST"
    );

    console.log(
        "======================================"
    );

    console.log(
        "\nStudent ID:",
        studentId
    );

    /*
    =================================================
    1. CREATE JOURNEY
    =================================================
    */

    console.log(
        "\n1. Creating journey..."
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

    printValleyStatus(
        journey
    );

    /*
    =================================================
    2. VERIFY INITIAL LOCKING
    =================================================
    */

    console.log(
        "\n2. Verifying initial valley locking..."
    );

    const initialExpected =
        [

            {
                name:
                    "Research Valley",

                status:
                    "current"

            },

            {
                name:
                    "Leadership Valley",

                status:
                    "locked"

            },

            {
                name:
                    "Essay Valley",

                status:
                    "locked"

            },

            {
                name:
                    "Application Valley",

                status:
                    "locked"

            }

        ];

    await verifyPersistence(
        initialExpected
    );

    /*
    =================================================
    3. COMPLETE RESEARCH
    =================================================
    */

    console.log(
        "\n3. Completing Research Valley..."
    );

    journey =
        await completeCurrentValley();

    /*
    =================================================
    4. VERIFY LEADERSHIP UNLOCK
    =================================================
    */

    console.log(
        "\n4. Verifying Leadership unlock..."
    );

    journey =
        await verifyPersistence(

            [

                {
                    name:
                        "Research Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Leadership Valley",

                    status:
                        "current"

                },

                {
                    name:
                        "Essay Valley",

                    status:
                        "locked"

                },

                {
                    name:
                        "Application Valley",

                    status:
                        "locked"

                }

            ]

        );

    /*
    =================================================
    5. COMPLETE LEADERSHIP
    =================================================
    */

    console.log(
        "\n5. Completing Leadership Valley..."
    );

    journey =
        await completeCurrentValley();

    /*
    =================================================
    6. VERIFY ESSAY UNLOCK
    =================================================
    */

    console.log(
        "\n6. Verifying Essay unlock..."
    );

    journey =
        await verifyPersistence(

            [

                {
                    name:
                        "Research Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Leadership Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Essay Valley",

                    status:
                        "current"

                },

                {
                    name:
                        "Application Valley",

                    status:
                        "locked"

                }

            ]

        );

    /*
    =================================================
    7. COMPLETE ESSAY
    =================================================
    */

    console.log(
        "\n7. Completing Essay Valley..."
    );

    journey =
        await completeCurrentValley();

    /*
    =================================================
    8. VERIFY APPLICATION UNLOCK
    =================================================
    */

    console.log(
        "\n8. Verifying Application unlock..."
    );

    journey =
        await verifyPersistence(

            [

                {
                    name:
                        "Research Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Leadership Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Essay Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Application Valley",

                    status:
                        "current"

                }

            ]

        );

    /*
    =================================================
    9. COMPLETE APPLICATION
    =================================================
    */

    console.log(
        "\n9. Completing Application Valley..."
    );

    journey =
        await completeCurrentValley();

    /*
    =================================================
    10. FINAL VERIFICATION
    =================================================
    */

    console.log(
        "\n10. Final journey verification..."
    );

    journey =
        await verifyPersistence(

            [

                {
                    name:
                        "Research Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Leadership Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Essay Valley",

                    status:
                        "completed"

                },

                {
                    name:
                        "Application Valley",

                    status:
                        "completed"

                }

            ]

        );

    /*
    =================================================
    VERIFY ALL VALLEYS = 100%
    =================================================
    */

    for (
        const valley
        of journey.valleys || []
    ) {

        if (
            valley.progress !== 100
        ) {

            throw new Error(
                `${valley.name} is not at 100%`
            );

        }

        if (
            valley.completed !== true
        ) {

            throw new Error(
                `${valley.name} is not marked completed`
            );

        }

    }

    /*
    =================================================
    11. FINAL PERSISTENCE CHECK
    =================================================
    */

    console.log(
        "\n11. Final persistence check..."
    );

    const finalResponse =
        await axios.get(

            `${BASE_URL}/api/journey/${studentId}`

        );

    const finalJourney =
        finalResponse.data.journey;

    for (
        const valley
        of finalJourney.valleys || []
    ) {

        console.log(
            `${valley.name}: ${valley.status} | ${valley.progress}%`
        );

    }

    console.log(
        "\n======================================"
    );

    console.log(
        "✓ JOURNEY PROGRESSION TEST PASSED"
    );

    console.log(
        "======================================"
    );

}

/*
=================================================
ERROR HANDLING
=================================================
*/

run()
    .catch(
        error => {

            console.error(
                "\n======================================"
            );

            console.error(
                "✗ JOURNEY PROGRESSION TEST FAILED"
            );

            console.error(
                "======================================"
            );

            if (
                error.response
            ) {

                console.error(
                    "HTTP status:",
                    error.response.status
                );

                console.error(
                    "Response:",
                    JSON.stringify(
                        error.response.data,
                        null,
                        2
                    )
                );

            }

            else {

                console.error(
                    error.message
                );

            }

        }
    );