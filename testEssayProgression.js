const axios = require("axios");

const BASE_URL = "http://localhost:3001";

const studentId = "student-leadership-flow-001";

/*
 * ESSAY JOURNEY PROGRESSION TEST
 *
 * This test assumes Leadership Valley has already
 * been completed and Essay Valley is now current.
 *
 * We will:
 * 1. Load the existing journey
 * 2. Find the first available Essay task
 * 3. Submit a strong answer
 * 4. Check AI evaluation
 * 5. Check Essay progress
 * 6. Confirm persistence
 */

function printJourney(journey) {

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
            `\n${valley.name} | status=${valley.status} | progress=${valley.progress}%`
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


function findCurrentTask(journey) {

    for (
        const valley
        of journey.valleys || []
    ) {

        if (
            valley.status !== "current"
        ) {

            continue;

        }

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
        "ESSAY JOURNEY PROGRESSION TEST"
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


    printJourney(
        journey
    );


    /*
     * --------------------------------------------------
     * 2. CHECK ESSAY VALLEY
     * --------------------------------------------------
     */

    const essayValley =
        journey.valleys.find(
            valley =>
                valley.id === "essay-valley"
        );


    if (!essayValley) {

        throw new Error(
            "Essay Valley was not found"
        );

    }


    console.log(
        "\n2. Essay Valley:"
    );


    console.log({
        status:
            essayValley.status,

        progress:
            essayValley.progress,

        completed:
            essayValley.completed
    });


    if (
        essayValley.status !== "current"
    ) {

        throw new Error(
            `Essay Valley is not current. Current status: ${essayValley.status}`
        );

    }


    /*
     * --------------------------------------------------
     * 3. FIND FIRST ESSAY TASK
     * --------------------------------------------------
     */

    let selectedTask = null;


    for (
        const checkpoint
        of essayValley.checkpoints || []
    ) {

        for (
            const task
            of checkpoint.tasks || []
        ) {

            if (
                !task.completed
            ) {

                selectedTask = task;

                break;

            }

        }

        if (
            selectedTask
        ) {

            break;

        }

    }


    if (!selectedTask) {

        throw new Error(
            "No unfinished Essay task found"
        );

    }


    console.log(
        "\n3. Dynamically selected Essay task:"
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


    /*
     * --------------------------------------------------
     * 4. SELECT ANSWER BASED ON TASK
     * --------------------------------------------------
     *
     * The first task should normally be
     * essay-motivation.
     *
     * We provide a strong scholarship-oriented
     * answer.
     */

    let answer;


    if (
        selectedTask.id === "essay-motivation"
    ) {

        answer =
            "My motivation for pursuing a Master's degree comes from my academic and professional interest in developing expertise that I can use to create meaningful impact in my community. Through my academic research and project experience, I have developed a strong interest in solving practical problems through evidence-based approaches. A Master's degree will allow me to deepen my knowledge, strengthen my analytical and leadership abilities, and learn from an international academic environment. I am particularly motivated by the opportunity to connect what I learn with real challenges in my community and contribute to long-term development. After completing the degree, I plan to apply the knowledge and skills I gain to my professional work and contribute to initiatives that improve opportunities and outcomes for others.";


    }
    else if (
        selectedTask.id === "essay-university"
    ) {

        answer =
            "I am interested in studying at a university that combines strong academic teaching, research opportunities, and an international learning environment. I want to choose a programme that directly supports my career goals and allows me to develop practical expertise alongside theoretical knowledge. I am particularly interested in opportunities to work with experienced academics, collaborate with students from different backgrounds, and apply what I learn to real-world challenges. The university environment would help me strengthen both my academic capabilities and my ability to contribute effectively to my community after graduation.";


    }
    else if (
        selectedTask.id === "essay-star-story"
    ) {

        answer =
            "Situation: During a university research project, our team needed to complete a large amount of data collection within a limited timeframe. Task: I was responsible for coordinating the team and ensuring that the work was completed accurately and on schedule. Action: I divided responsibilities according to each member's strengths, established clear deadlines, and introduced regular check-ins to identify problems early. I also reviewed the collected information and helped team members resolve issues with data quality. Result: The team completed the research successfully and improved its coordination and consistency. The experience strengthened my ability to communicate clearly, delegate responsibilities, solve problems, and adapt my leadership approach to the needs of a team.";


    }
    else if (
        selectedTask.id === "essay-impact"
    ) {

        answer =
            "My experiences have shaped my understanding of the kind of impact I want to create through my career. Academic research and leadership projects have taught me how to analyse problems, work collaboratively, and turn ideas into practical outcomes. I want to use these skills to contribute to education and community development, particularly by helping create better opportunities for people in my community. A Master's degree will strengthen my technical knowledge, leadership ability, and international perspective, allowing me to contribute more effectively to these goals.";


    }
    else if (
        selectedTask.id === "essay-clarity"
    ) {

        answer =
            "My career goal is to build expertise in my field and use that knowledge to contribute to education and community development. My academic and leadership experiences have shown me the importance of combining technical knowledge with communication, teamwork, and practical problem-solving. Through a Master's degree, I want to strengthen these capabilities and gain an international perspective that will help me address challenges more effectively. After graduation, I plan to apply these skills in my professional work and contribute to initiatives that create sustainable opportunities for my community.";


    }
    else if (
        selectedTask.id === "essay-alignment"
    ) {

        answer =
            "My academic background, leadership experiences, career goals, and scholarship motivation are closely connected. My academic and research experiences developed my analytical skills, while leading projects strengthened my communication, delegation, and problem-solving abilities. These experiences have motivated me to pursue further study so I can develop deeper expertise and gain an international perspective. In the future, I want to apply this knowledge to my career and contribute to education and community development. The scholarship therefore represents an important step between my existing experience, my Master's studies, and my long-term contribution to my community.";


    }
    else {

        answer =
            "My academic, leadership, and professional experiences have helped me understand my goals and the areas where I need further development. I want to strengthen my knowledge through postgraduate study, gain an international perspective, and develop the skills necessary to create meaningful impact in my community. I will use the knowledge and experience gained during my studies to contribute to my career and support long-term development in my community.";

    }


    /*
     * --------------------------------------------------
     * 5. SUBMIT ESSAY ANSWER
     * --------------------------------------------------
     */

    console.log(
        "\n4. Submitting Essay task answer..."
    );


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
     * 6. SHOW EVALUATION
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
     * 7. SHOW UPDATED TASK
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
     * 8. SHOW UPDATED JOURNEY
     * --------------------------------------------------
     */

    console.log(
        "\n5. Updated journey:"
    );


    printJourney(
        taskResponse.data.journey
    );


    /*
     * --------------------------------------------------
     * 9. CHECK ESSAY PROGRESS
     * --------------------------------------------------
     */

    const updatedJourney =
        taskResponse.data.journey;


    const updatedEssayValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "essay-valley"
        );


    console.log(
        "\n6. Essay Valley progress:"
    );


    console.log({
        status:
            updatedEssayValley.status,

        progress:
            updatedEssayValley.progress,

        completed:
            updatedEssayValley.completed
    });


    /*
     * --------------------------------------------------
     * 10. VERIFY APPLICATION IS STILL LOCKED
     * --------------------------------------------------
     */

    const applicationValley =
        updatedJourney.valleys.find(
            valley =>
                valley.id === "application-valley"
        );


    console.log(
        "\n7. Application Valley:"
    );


    console.log({
        status:
            applicationValley.status,

        progress:
            applicationValley.progress,

        completed:
            applicationValley.completed
    });


    /*
     * --------------------------------------------------
     * 11. VERIFY PERSISTENCE
     * --------------------------------------------------
     */

    console.log(
        "\n8. Loading journey again to verify persistence..."
    );


    const persistedResponse =
        await axios.get(
            `${BASE_URL}/api/journey/${studentId}`
        );


    const persistedJourney =
        persistedResponse.data.journey;


    let persistedTask = null;


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
                    task.id === selectedTask.id
                ) {

                    persistedTask = task;

                }

            }

        }

    }


    console.log(
        "\nPersisted Essay task:"
    );


    console.log(
        JSON.stringify(
            persistedTask,
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
        "ESSAY PROGRESSION TEST COMPLETE"
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