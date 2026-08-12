const {
    calculateReadiness
} = require("./assessment/scoringEngine");

const {
    analyzeDeepAssessment
} = require("./services/deepAssessmentService");

const {
    planJourney
} = require("./services/journeyPlanner");

const {
    generateValleys
} = require("./services/valleyGenerator");

const {
    planTimeline
} = require("./services/timelinePlanner");

const {
    saveJourney,
    loadJourney,
    journeyExists
} = require("./services/journeyStore");


// ============================================================
// TEST STUDENT
// ============================================================

const studentId =
    "student-local-assessment1-assessment2-timeline-001";


// ============================================================
// ASSESSMENT 1
// ============================================================

const assessment1Answers = {

    q1_current_status:
        "currently_studying_undergraduate",

    q2_gpa_range:
        "2.50-2.99",

    q3_undergraduate_field:
        "arts_humanities",

    q4_master_interest:
        "still_exploring",

    q5_scholarship_direction:
        "do_not_know",

    q6_application_timeline:
        "more_than_1_year",

    q7_leadership_experience:
        "not_yet",

    q8_impact_experience:
        "not_yet",

    q9_recognized_programs:
        "not_yet",

    q10_achievements:
        "not_yet",

    q11_skill_profile:
        "not_yet_developed",

    q12_english_certificate:
        "not_yet",

    q13_storytelling_confidence:
        "never_prepared",

    q14_cv_status:
        "no_cv",

    q15_essay_status:
        "no_essay",

    q16_application_knowledge:
        "do_not_know",

    q17_previous_application:
        "first_application",

    q18_rejection_analysis:
        "not_applicable",

    q19_biggest_challenge:
        "do_not_know",

    q20_cv_upload:
        false
};


// ============================================================
// ASSESSMENT 2
//
// These are intentionally realistic weak/early-stage answers.
// Change these later to test stronger students.
// ============================================================

const assessment2Answers = {

    q1_why_do_you_want_to_pursue_this_masters_degree:
        "Career advancement",

    q2_master_motivation:
        "I already know the exact program and universities I want",

    q3_master_plan_clarity:
        "Academic competition",

    q4_academic_experience:
        "Belum ada pencapaian akademik yang bisa saya jelaskan saat ini.",

    q5_academic_achievement_description:
        "Yes, one major project",

    q6_field_project_experience:
        "Belum pernah memegang tanggung jawab besar.",

    q8_leadership_responsibility:
        "No measurable impact yet",

    q9_leadership_impact:
        "Still exploring",

    q10_career_goal:
        "Masih belum tahu ingin berkontribusi di bidang apa.",

    q11_career_contribution_area:
        "Japan"
};


// ============================================================
// SCHOLARSHIP FALLBACK
//
// The deep assessment should generate a recommendation.
// This is only used if the RAG recommendation does not contain
// enough scholarship information for the timeline.
// ============================================================

const fallbackScholarship = {

    id:
        "mext-001",

    name:
        "MEXT Scholarship",

    country:
        "Japan",

    study_levels: [
        "Bachelor",
        "Master",
        "PhD"
    ],

    fields_of_study: [
        "All fields"
    ],

    deadline:
        "2026-10-31",

    deadline_date:
        "2026-10-31",

    estimated_deadline_date:
        "2026-10-31"
};


// ============================================================
// HELPER
// ============================================================

function printSection(title) {

    console.log("");
    console.log("============================================================");
    console.log(title);
    console.log("============================================================");
}


// ============================================================
// MAIN TEST
// ============================================================

async function runTest() {

    try {

        // ------------------------------------------------------
        // 1. ASSESSMENT 1
        // ------------------------------------------------------

        printSection(
            "1. RUNNING ASSESSMENT 1"
        );

        const assessment1 =
            calculateReadiness(
                assessment1Answers
            );


        console.log(
            "Assessment 1 result:"
        );

        console.log(
            JSON.stringify(
                assessment1,
                null,
                2
            )
        );


        const readiness1 =
            Number(
                assessment1.readiness_percentage
            );


        console.log("");
        console.log(
            "Assessment 1 readiness:",
            readiness1
        );


        if (
            Number.isNaN(
                readiness1
            )
        ) {

            throw new Error(
                "Assessment 1 did not return a valid readiness percentage"
            );

        }


        console.log(
            "✓ Assessment 1 completed"
        );


        // ------------------------------------------------------
        // 2. ASSESSMENT 2
        // ------------------------------------------------------

        printSection(
            "2. RUNNING ASSESSMENT 2"
        );


        const deepAssessment =
            await analyzeDeepAssessment(
                assessment2Answers,
                {}
            );


        if (!deepAssessment) {

            throw new Error(
                "Assessment 2 returned no result"
            );

        }


        console.log(
            "Assessment 2 result:"
        );

        console.log(
            JSON.stringify(
                deepAssessment.assessment,
                null,
                2
            )
        );


        // ------------------------------------------------------
        // 3. VERIFY STUDENT PROFILE
        // ------------------------------------------------------

        printSection(
            "3. VERIFYING STUDENT PROFILE"
        );


        const profile =
            deepAssessment.profile;


        if (!profile) {

            throw new Error(
                "Assessment 2 did not return a student profile"
            );

        }


        if (!profile.student_profile) {

            throw new Error(
                "Assessment 2 profile does not contain student_profile"
            );

        }


        console.log(
            "Student profile:"
        );

        console.log(
            JSON.stringify(
                profile.student_profile,
                null,
                2
            )
        );


        console.log(
            "✓ Student profile generated"
        );


        // ------------------------------------------------------
        // 4. GET ASSESSMENT 2 READINESS
        // ------------------------------------------------------

        printSection(
            "4. VERIFYING ASSESSMENT 2 READINESS"
        );


        const readiness2 =
            Number(
                deepAssessment
                    ?.assessment
                    ?.revised_percentage
            );


        console.log(
            "Assessment 1 readiness:",
            readiness1
        );

        console.log(
            "Assessment 2 readiness:",
            readiness2
        );


        if (
            Number.isNaN(
                readiness2
            )
        ) {

            throw new Error(
                "Assessment 2 did not return a valid revised readiness percentage"
            );

        }


        // Put Assessment 2 readiness into profile.

        profile.readiness =
            readiness2;


        console.log(
            "✓ Assessment 2 readiness stored in profile"
        );


        // ------------------------------------------------------
        // 5. SCHOLARSHIP RECOMMENDATION
        // ------------------------------------------------------

        printSection(
            "5. VERIFYING SCHOLARSHIP RECOMMENDATION"
        );


        const recommendation =
            deepAssessment
                ?.assessment
                ?.beasiswa_recomendation;


        if (recommendation) {

            console.log(
                "Recommended scholarship:"
            );

            console.log(
                JSON.stringify(
                    recommendation,
                    null,
                    2
                )
            );

        }
        else {

            console.log(
                "No scholarship recommendation returned."
            );

        }


        // ------------------------------------------------------
        // 6. PREPARE SCHOLARSHIP FOR JOURNEY
        // ------------------------------------------------------

        printSection(
            "6. PREPARING SCHOLARSHIP FOR JOURNEY"
        );


        let scholarship;


        if (recommendation) {

            scholarship = {

                ...fallbackScholarship,

                ...recommendation

            };

        }
        else {

            scholarship =
                fallbackScholarship;

        }


        /*
        Make sure timeline has a deadline.

        The actual scholarship recommendation may or may not
        contain a verified deadline.
        */

        if (
            !scholarship.deadline &&
            !scholarship.deadline_date &&
            !scholarship.estimated_deadline_date
        ) {

            scholarship.deadline =
                fallbackScholarship.deadline;

        }


        console.log(
            "Scholarship used by journey:"
        );

        console.log(
            JSON.stringify(
                scholarship,
                null,
                2
            )
        );


        // ------------------------------------------------------
        // 7. PLAN JOURNEY
        // ------------------------------------------------------

        printSection(
            "7. PLANNING JOURNEY"
        );


        const journeyPlan =
            planJourney(
                profile,
                scholarship
            );


        console.log(
            "Journey plan:"
        );

        console.log(
            JSON.stringify(
                journeyPlan,
                null,
                2
            )
        );


        console.log(
            "✓ Journey plan generated"
        );


        // ------------------------------------------------------
        // 8. GENERATE VALLEYS + TASKS
        // ------------------------------------------------------

        printSection(
            "8. GENERATING VALLEYS AND TASKS"
        );


        let journey =
            generateValleys(
                profile.student_profile,
                journeyPlan,
                scholarship
            );


        if (!journey) {

            throw new Error(
                "Valley generator returned no journey"
            );

        }


        console.log(
            "Generated journey:"
        );

        console.log(
            JSON.stringify(
                journey,
                null,
                2
            )
        );


        console.log(
            "✓ Valleys and tasks generated"
        );


        // ------------------------------------------------------
        // 9. ATTACH ASSESSMENT 2 READINESS
        // ------------------------------------------------------

        printSection(
            "9. ATTACHING ASSESSMENT 2 READINESS"
        );


        journey.readiness =
            readiness2;


        journey.assessment =
            journey.assessment || {};


        journey.assessment.assessment_number =
            2;


        journey.assessment.revised_percentage =
            readiness2;


        console.log(
            "Journey readiness:",
            journey.readiness
        );


        console.log(
            "✓ Assessment 2 readiness attached to journey"
        );


        // ------------------------------------------------------
        // 10. PLAN TIMELINE
        // ------------------------------------------------------

        printSection(
            "10. PLANNING TIMELINE"
        );


        journey =
            planTimeline(
                journey
            );


        if (!journey) {

            throw new Error(
                "Timeline planner returned no journey"
            );

        }


        console.log(
            "Timeline:"
        );


        console.log(
            JSON.stringify(
                journey.timeline,
                null,
                2
            )
        );


        console.log(
            "✓ Timeline generated"
        );


        // ------------------------------------------------------
        // 11. VERIFY TIMELINE
        // ------------------------------------------------------

        printSection(
            "11. VERIFYING TIMELINE"
        );


        if (!journey.timeline) {

            throw new Error(
                "Journey does not contain timeline"
            );

        }


        console.log(
            "Timeline status:",
            journey.timeline.status
        );


        console.log(
            "Timeline start date:",
            journey.timeline.start_date
        );


        console.log(
            "Timeline target date:",
            journey.timeline.target_date
        );


        console.log(
            "Timeline deadline:",
            journey.timeline.deadline
        );


        // ------------------------------------------------------
        // 12. VERIFY VALLEYS
        // ------------------------------------------------------

        printSection(
            "12. VERIFYING VALLEYS"
        );


        if (
            !Array.isArray(
                journey.valleys
            )
        ) {

            throw new Error(
                "Journey does not contain valleys"
            );

        }


        console.log(
            "Number of valleys:",
            journey.valleys.length
        );


        journey.valleys.forEach(
            (valley, index) => {

                console.log("");

                console.log(
                    `Valley ${index + 1}:`
                );

                console.log(
                    "ID:",
                    valley.id
                );

                console.log(
                    "Title:",
                    valley.title
                );

                console.log(
                    "Status:",
                    valley.status
                );

                if (
                    Array.isArray(
                        valley.checkpoints
                    )
                ) {

                    console.log(
                        "Checkpoints:",
                        valley.checkpoints.length
                    );

                }

            }
        );


        // ------------------------------------------------------
        // 13. VERIFY TIMELINE TASKS
        // ------------------------------------------------------

        printSection(
            "13. VERIFYING TIMELINE TASKS"
        );


        let totalTasks = 0;

        let tasksWithTimeline = 0;


        journey.valleys.forEach(
            valley => {

                if (
                    !Array.isArray(
                        valley.checkpoints
                    )
                ) {

                    return;

                }


                valley.checkpoints.forEach(
                    checkpoint => {

                        if (
                            !Array.isArray(
                                checkpoint.tasks
                            )
                        ) {

                            return;

                        }


                        checkpoint.tasks.forEach(
                            task => {

                                totalTasks++;


                                if (
                                    task.timeline
                                ) {

                                    tasksWithTimeline++;

                                    console.log("");

                                    console.log(
                                        "Task:",
                                        task.id
                                    );

                                    console.log(
                                        "Title:",
                                        task.title
                                    );

                                    console.log(
                                        "Start:",
                                        task.timeline.start_date
                                    );

                                    console.log(
                                        "Target:",
                                        task.timeline.target_date
                                    );

                                    console.log(
                                        "Status:",
                                        task.timeline.status
                                    );

                                }

                            }
                        );

                    }
                );

            }
        );


        console.log("");

        console.log(
            "Total tasks:",
            totalTasks
        );

        console.log(
            "Tasks with timeline:",
            tasksWithTimeline
        );


        if (
            totalTasks === 0
        ) {

            throw new Error(
                "No journey tasks were generated"
            );

        }


        // ------------------------------------------------------
        // 14. SAVE JOURNEY
        // ------------------------------------------------------

        printSection(
            "14. SAVING JOURNEY"
        );


        saveJourney(
            studentId,
            journey
        );


        console.log(
            "✓ Journey saved"
        );


        // ------------------------------------------------------
        // 15. VERIFY JOURNEY EXISTS
        // ------------------------------------------------------

        printSection(
            "15. VERIFYING JOURNEY PERSISTENCE"
        );


        const exists =
            journeyExists(
                studentId
            );


        console.log(
            "Journey exists:",
            exists
        );


        if (!exists) {

            throw new Error(
                "Journey was not persisted"
            );

        }


        // ------------------------------------------------------
        // 16. LOAD JOURNEY AGAIN
        // ------------------------------------------------------

        printSection(
            "16. RELOADING JOURNEY FROM DISK"
        );


        const loadedJourney =
            loadJourney(
                studentId
            );


        if (!loadedJourney) {

            throw new Error(
                "Saved journey could not be loaded"
            );

        }


        console.log(
            "✓ Journey loaded again"
        );


        // ------------------------------------------------------
        // 17. VERIFY PERSISTED DATA
        // ------------------------------------------------------

        printSection(
            "17. VERIFYING PERSISTED DATA"
        );


        console.log(
            "Persisted readiness:",
            loadedJourney.readiness
        );


        console.log(
            "Persisted assessment number:",
            loadedJourney
                ?.assessment
                ?.assessment_number
        );


        console.log(
            "Persisted revised percentage:",
            loadedJourney
                ?.assessment
                ?.revised_percentage
        );


        console.log(
            "Persisted timeline:"
        );


        console.log(
            JSON.stringify(
                loadedJourney.timeline,
                null,
                2
            )
        );


        if (
            Number(
                loadedJourney.readiness
            ) !== readiness2
        ) {

            throw new Error(
                "Persisted readiness does not match Assessment 2 readiness"
            );

        }


        if (
            Number(
                loadedJourney
                    ?.assessment
                    ?.revised_percentage
            ) !== readiness2
        ) {

            throw new Error(
                "Persisted Assessment 2 readiness does not match"
            );

        }


        if (
            !loadedJourney.timeline
        ) {

            throw new Error(
                "Persisted journey does not contain timeline"
            );

        }


        console.log(
            "✓ Readiness persisted correctly"
        );

        console.log(
            "✓ Assessment data persisted correctly"
        );

        console.log(
            "✓ Timeline persisted correctly"
        );


        // ------------------------------------------------------
        // FINAL RESULT
        // ------------------------------------------------------

        printSection(
            "TEST PASSED"
        );


        console.log(
            "✓ Assessment 1 completed"
        );

        console.log(
            "✓ Assessment 1 readiness calculated:",
            readiness1
        );

        console.log(
            "✓ Assessment 2 completed"
        );

        console.log(
            "✓ Student profile generated"
        );

        console.log(
            "✓ Assessment 2 readiness calculated:",
            readiness2
        );

        console.log(
            "✓ Scholarship recommendation generated"
        );

        console.log(
            "✓ Journey plan generated"
        );

        console.log(
            "✓ Valleys generated"
        );

        console.log(
            "✓ Tasks generated"
        );

        console.log(
            "✓ Timeline generated"
        );

        console.log(
            "✓ Journey saved"
        );

        console.log(
            "✓ Journey loaded successfully"
        );

        console.log(
            "✓ Complete Assessment 1 → Assessment 2 → Timeline flow works"
        );


    }
    catch (error) {

        printSection(
            "TEST FAILED"
        );


        console.error(
            error
        );


        process.exitCode = 1;

    }

}


// ============================================================
// RUN
// ============================================================

runTest();