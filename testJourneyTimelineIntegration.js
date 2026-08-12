const assert = require("assert");

const {
    loadJourney,
    saveJourney
} = require("./services/journeyStore");

const {
    planTimeline
} = require("./services/timelinePlanner");

const {
    submitTaskAnswer
} = require("./services/journeyTaskService");


/*
=========================================================
REAL JOURNEY TIMELINE INTEGRATION TEST
=========================================================

This test verifies the ACTUAL journey engine state.

It does NOT only test timelinePlanner.js.

Flow:

Journey
    ↓
Existing generated journey
    ↓
Timeline generation
    ↓
Task completion
    ↓
Progress Service
    ↓
Timeline status synchronization
    ↓
Persistence
    ↓
Reload
    ↓
Verify everything is still consistent
=========================================================
*/


const STUDENT_ID =
    "student-real-timeline-integration-001";


/*
---------------------------------------------------------
Scholarship with a REAL deadline.

This is important because our previous Chevening test
did not contain a usable deadline and therefore produced:

deadline_date = null
timeline_status = needs_deadline_verification

For this integration test we deliberately provide
a concrete deadline.
---------------------------------------------------------
*/

const scholarship = {

    id:
        "timeline-integration-scholarship",

    name:
        "Timeline Integration Scholarship",

    deadline: {

        application_period:
            "2026-10-31"

    }

};


/*
---------------------------------------------------------
Find a task anywhere in the journey.
---------------------------------------------------------
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
---------------------------------------------------------
Print a task in a readable format.
---------------------------------------------------------
*/

function printTask(
    label,
    task
) {

    console.log(
        `\n${label}:`
    );

    console.log(
        JSON.stringify(
            task,
            null,
            2
        )
    );

}


/*
---------------------------------------------------------
Main test
---------------------------------------------------------
*/

async function run() {

    console.log(
        "\n================================================="
    );

    console.log(
        "REAL JOURNEY TIMELINE INTEGRATION TEST"
    );

    console.log(
        "=================================================\n"
    );


    /*
    =================================================
    STEP 1
    Load an EXISTING real journey.
    =================================================
    */

    console.log(
        "1. Loading existing journey..."
    );

    let journey =
        loadJourney(
            STUDENT_ID
        );


    /*
    If this is the first run, create a small
    journey fixture using the existing journey
    engine modules.

    IMPORTANT:
    We do NOT manually construct valleys/tasks.
    We use the actual journey generation engine.
    */

    if (!journey) {

        console.log(
            "   No saved journey found."
        );

        console.log(
            "   Creating integration journey..."
        );


        /*
        ---------------------------------------------
        Use the same journey creation services
        used by the real API.
        ---------------------------------------------
        */

        const {
            analyzeDeepAssessment
        } = require(
            "./services/deepAssessmentService"
        );


        const {
            planJourney
        } = require(
            "./services/journeyPlanner"
        );


        const {
            generateValleys
        } = require(
            "./services/valleyGenerator"
        );


        /*
        ---------------------------------------------
        Minimal but valid Assessment 2 answers.

        The exact scoring is NOT the purpose of this
        test. We only need the real Assessment 2
        engine to produce a valid readiness.
        ---------------------------------------------
        */

        const answers = {

            q1_why_do_you_want_to_pursue_this_masters_degree:
                "Career advancement",

            q2_master_motivation:
                "I already know the exact program and universities I want",

            q3_master_plan_clarity:
                "Academic competition",

            q4_academic_experience:
                "I have academic experience",

            q5_academic_achievement_description:
                "Yes, one major project",

            q6_field_project_experience:
                "Student organization leadership",

            q7_leadership_experience:
                "I have leadership experience",

            q8_leadership_responsibility:
                "I managed responsibilities within a team",

            q9_leadership_impact:
                "I achieved measurable impact",

            q10_career_goal:
                "I want to contribute to my field",

            q11_career_contribution_area:
                "Research and education",

            q12_target_countries:
                "United Kingdom",

            q13_scholarship_type:
                "Fully funded scholarship",

            q14_scholarship_priority:
                "Professional CV with achievements",

            q15_cv_strength:
                "I have a clear story and draft",

            q16_essay_readiness:
                "Yes, professors/supervisors are available",

            q17_recommendation_availability:
                "More than 10 hours/week",

            q18_preparation_time:
                "Within 3 months",

            q19_application_deadline_target:
                "Improve my profile competitiveness"

        };


        /*
        ---------------------------------------------
        Real Assessment 2
        ---------------------------------------------
        */

        const deepAssessment =
            analyzeDeepAssessment(
                answers,
                {}
            );


        assert(
            deepAssessment &&
            deepAssessment.profile,
            "Assessment 2 did not return a profile"
        );


        const profile =
            deepAssessment.profile;


        const readiness =
            Number(
                deepAssessment
                    ?.assessment
                    ?.revised_percentage
            );


        assert(
            !Number.isNaN(
                readiness
            ),
            "Assessment 2 readiness is invalid"
        );


        profile.readiness =
            readiness;


        /*
        ---------------------------------------------
        Real journey planner
        ---------------------------------------------
        */

        const journeyPlan =
            planJourney(
                profile,
                scholarship
            );


        /*
        ---------------------------------------------
        Real valley generator
        ---------------------------------------------
        */

        journey =
            generateValleys(
                profile.student_profile,
                journeyPlan,
                scholarship
            );


        /*
        ---------------------------------------------
        Real timeline planner
        ---------------------------------------------
        */

        const timelineResult =
            planTimeline(
                journey
            );


        journey.timeline =
            timelineResult.timeline;


        /*
        ---------------------------------------------
        Expose readiness exactly like the real API.
        ---------------------------------------------
        */

        journey.readiness =
            readiness;


        journey.assessment =
            journey.assessment || {};


        journey.assessment.assessment_number =
            2;


        journey.assessment.revised_percentage =
            readiness;


        journey.scholarship =
            scholarship;


        /*
        ---------------------------------------------
        Persist it using the real Journey Store.
        ---------------------------------------------
        */

        saveJourney(
            STUDENT_ID,
            journey
        );


        console.log(
            "   ✓ Real journey created and saved."
        );

    } else {

        console.log(
            "   ✓ Existing journey loaded."
        );

    }


    /*
    =================================================
    STEP 2
    Verify the journey contains a timeline.
    =================================================
    */

    console.log(
        "\n2. Verifying journey timeline..."
    );


    assert(
        journey.timeline,
        "Journey does not contain a timeline"
    );


    assert(
        Array.isArray(
            journey.timeline.valleys
        ),
        "Timeline valleys are missing"
    );


    console.log(
        "   Timeline status:",
        journey.timeline.timeline_status
    );


    console.log(
        "   Start date:",
        journey.timeline.start_date
    );


    console.log(
        "   Target date:",
        journey.timeline.target_date
    );


    console.log(
        "   Deadline:",
        journey.timeline?.deadline?.deadline_date
    );


    /*
    =================================================
    STEP 3
    Verify the deadline actually reached the timeline.
    =================================================
    */

    console.log(
        "\n3. Verifying scholarship deadline integration..."
    );


    const deadline =
        journey
            .timeline
            ?.deadline
            ?.deadline_date;


    assert(
        deadline,
        "Timeline did not receive a deadline"
    );


    console.log(
        "   ✓ Deadline reached timeline:"
    );

    console.log(
        "   ",
        deadline
    );


    /*
    =================================================
    STEP 4
    Find a REAL generated task.
    =================================================
    */

    console.log(
        "\n4. Finding real journey task..."
    );


    const firstValley =
        journey.valleys?.[0];


    assert(
        firstValley,
        "Journey has no first valley"
    );


    const firstCheckpoint =
        firstValley.checkpoints?.[0];


    assert(
        firstCheckpoint,
        "First valley has no checkpoint"
    );


    const task =
        firstCheckpoint.tasks?.[0];


    assert(
        task,
        "First checkpoint has no task"
    );


    const taskId =
        task.id;


    console.log(
        "   Valley:",
        firstValley.id
    );


    console.log(
        "   Checkpoint:",
        firstCheckpoint.id
    );


    console.log(
        "   Task:",
        taskId
    );


    printTask(
        "Original task",
        task
    );


    /*
    =================================================
    STEP 5
    Find corresponding timeline task.
    =================================================
    */

    console.log(
        "\n5. Finding corresponding timeline task..."
    );


    let timelineTask = null;


    for (
        const timelineValley
        of journey.timeline.valleys || []
    ) {

        for (
            const candidate
            of timelineValley.tasks || []
        ) {

            if (
                candidate.id === taskId
            ) {

                timelineTask =
                    candidate;

            }

        }

    }


    assert(
        timelineTask,
        `Task ${taskId} does not exist in timeline`
    );


    printTask(
        "Original timeline task",
        timelineTask
    );


    /*
    =================================================
    STEP 6
    Save original dates.
    =================================================
    */

    console.log(
        "\n6. Recording original task dates..."
    );


    const originalStartDate =
        timelineTask
            ?.timeline
            ?.start_date;


    const originalTargetDate =
        timelineTask
            ?.timeline
            ?.target_date;


    assert(
        originalStartDate,
        "Timeline task has no start_date"
    );


    assert(
        originalTargetDate,
        "Timeline task has no target_date"
    );


    console.log(
        "   Start:",
        originalStartDate
    );


    console.log(
        "   Target:",
        originalTargetDate
    );


    /*
    =================================================
    STEP 7
    Submit answer through the REAL task service.
    
    This is important:
    
    We are NOT calling updateJourneyProgress()
    directly.
    
    We are using the same service used by:
    
    POST /api/journey/task/evaluate
    =================================================
    */

    console.log(
        "\n7. Submitting answer through real journey task engine..."
    );


    const result =
        await submitTaskAnswer({

            journey,

            taskId,

            studentAnswer:
                "I participated in a research project where I helped collect data, analyze findings, coordinate responsibilities with the team, and contribute to the final research output.",

            scholarship

        });


    assert(
        result &&
        result.journey,
        "Task service did not return updated journey"
    );


    journey =
        result.journey;


    console.log(
        "   Evaluation:"
    );


    console.log(
        JSON.stringify(
            result.evaluation,
            null,
            2
        )
    );


    console.log(
        "\n   Updated task:"
    );


    console.log(
        JSON.stringify(
            result.task,
            null,
            2
        )
    );


    /*
    =================================================
    STEP 8
    Verify task completion.
    =================================================
    */

    console.log(
        "\n8. Verifying task completion..."
    );


    const updatedTask =
        findTask(
            journey,
            taskId
        );


    assert(
        updatedTask,
        "Updated task cannot be found"
    );


    console.log(
        "   completed:",
        updatedTask.completed
    );


    /*
    If the AI rejects the answer, this test should
    fail because this test is intentionally verifying
    the COMPLETE path.

    If your AI evaluation is nondeterministic and
    rejects the answer, use a stronger answer rather
    than weakening this assertion.
    */

    assert(
        updatedTask.completed === true,
        "Task was not completed by the AI evaluation"
    );


    console.log(
        "   ✓ Task completed by actual AI evaluation."
    );


    /*
    =================================================
    STEP 9
    Verify timeline status changed.
    =================================================
    */

    console.log(
        "\n9. Verifying timeline status synchronization..."
    );


    let updatedTimelineTask =
        null;


    for (
        const timelineValley
        of journey.timeline.valleys || []
    ) {

        for (
            const candidate
            of timelineValley.tasks || []
        ) {

            if (
                candidate.id === taskId
            ) {

                updatedTimelineTask =
                    candidate;

            }

        }

    }


    assert(
        updatedTimelineTask,
        "Updated task is missing from timeline"
    );


    const timelineStatus =
        updatedTimelineTask
            ?.timeline
            ?.status;


    console.log(
        "   Timeline status:",
        timelineStatus
    );


    assert(
        timelineStatus === "completed",
        `Expected timeline status to be completed, got ${timelineStatus}`
    );


    console.log(
        "   ✓ Timeline status synchronized."
    );


    /*
    =================================================
    STEP 10
    CRITICAL:
    
    Verify dates DID NOT CHANGE.
    =================================================
    */

    console.log(
        "\n10. Verifying task dates remained unchanged..."
    );


    const updatedStartDate =
        updatedTimelineTask
            ?.timeline
            ?.start_date;


    const updatedTargetDate =
        updatedTimelineTask
            ?.timeline
            ?.target_date;


    console.log(
        "   Original start:",
        originalStartDate
    );


    console.log(
        "   Updated start:",
        updatedStartDate
    );


    console.log(
        "   Original target:",
        originalTargetDate
    );


    console.log(
        "   Updated target:",
        updatedTargetDate
    );


    assert(
        updatedStartDate ===
        originalStartDate,
        "Task start_date changed after completion"
    );


    assert(
        updatedTargetDate ===
        originalTargetDate,
        "Task target_date changed after completion"
    );


    console.log(
        "   ✓ Task dates remained unchanged."
    );


    /*
    =================================================
    STEP 11
    Persist the updated journey.
    =================================================
    */

    console.log(
        "\n11. Saving updated journey..."
    );


    saveJourney(
        STUDENT_ID,
        journey
    );


    console.log(
        "   ✓ Updated journey saved."
    );


    /*
    =================================================
    STEP 12
    Reload from Journey Store.
    
    This proves the state survives persistence.
    =================================================
    */

    console.log(
        "\n12. Reloading journey from disk..."
    );


    const persistedJourney =
        loadJourney(
            STUDENT_ID
        );


    assert(
        persistedJourney,
        "Persisted journey could not be loaded"
    );


    console.log(
        "   ✓ Journey loaded again."
    );


    /*
    =================================================
    STEP 13
    Verify persisted task.
    =================================================
    */

    console.log(
        "\n13. Verifying persisted task..."
    );


    const persistedTask =
        findTask(
            persistedJourney,
            taskId
        );


    assert(
        persistedTask,
        "Persisted task cannot be found"
    );


    printTask(
        "Persisted task",
        persistedTask
    );


    assert(
        persistedTask.completed === true,
        "Task completion was not persisted"
    );


    /*
    =================================================
    STEP 14
    Verify persisted timeline status.
    =================================================
    */

    console.log(
        "\n14. Verifying persisted timeline status..."
    );


    let persistedTimelineTask =
        null;


    for (
        const timelineValley
        of persistedJourney
            .timeline
            ?.valleys || []
    ) {

        for (
            const candidate
            of timelineValley.tasks || []
        ) {

            if (
                candidate.id === taskId
            ) {

                persistedTimelineTask =
                    candidate;

            }

        }

    }


    assert(
        persistedTimelineTask,
        "Persisted timeline task cannot be found"
    );


    const persistedStatus =
        persistedTimelineTask
            ?.timeline
            ?.status;


    console.log(
        "   Persisted timeline status:",
        persistedStatus
    );


    assert(
        persistedStatus === "completed",
        "Timeline completed status was not persisted"
    );


    /*
    =================================================
    STEP 15
    Verify persisted dates.
    =================================================
    */

    console.log(
        "\n15. Verifying persisted dates..."
    );


    const persistedStart =
        persistedTimelineTask
            ?.timeline
            ?.start_date;


    const persistedTarget =
        persistedTimelineTask
            ?.timeline
            ?.target_date;


    assert(
        persistedStart ===
        originalStartDate,
        "Persisted start_date changed"
    );


    assert(
        persistedTarget ===
        originalTargetDate,
        "Persisted target_date changed"
    );


    console.log(
        "   ✓ Persisted dates are unchanged."
    );


    /*
    =================================================
    SUCCESS
    =================================================
    */

    console.log(
        "\n================================================="
    );

    console.log(
        "✓ REAL JOURNEY TIMELINE INTEGRATION TEST PASSED"
    );

    console.log(
        "================================================="
    );


    console.log(
        "\nVerified:"
    );

    console.log(
        "✓ Real Assessment 2 → Journey engine"
    );

    console.log(
        "✓ Real scholarship deadline → Timeline"
    );

    console.log(
        "✓ Real generated task → Timeline task"
    );

    console.log(
        "✓ Real AI task evaluation"
    );

    console.log(
        "✓ Real task completion"
    );

    console.log(
        "✓ Progress → Timeline status synchronization"
    );

    console.log(
        "✓ Task dates remain stable"
    );

    console.log(
        "✓ Journey persistence"
    );

    console.log(
        "✓ Timeline persistence"
    );

    console.log(
        "\nStudent:",
        STUDENT_ID
    );

}


/*
---------------------------------------------------------
Run test
---------------------------------------------------------
*/

run()
    .catch(
        error => {

            console.error(
                "\n✗ REAL JOURNEY TIMELINE INTEGRATION TEST FAILED"
            );

            console.error(
                "\n",
                error
            );

            process.exit(
                1
            );

        }
    );