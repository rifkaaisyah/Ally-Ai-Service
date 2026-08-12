/*
=========================================================
LOCAL FULL PIPELINE TEST
=========================================================

Assessment 1
    ↓
Assessment 2
    ↓
Journey
    ↓
Timeline

This test uses localhost.

DO NOT USE NGROK.
=========================================================
*/


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


const scholarship = {

    id:
        "lpdp-001",

    name:
        "LPDP Scholarship"

};


const studentId =
    "local-test-" +
    Date.now();


/*
=========================================================
HELPER
=========================================================
*/

async function post(
    url,
    body
) {

    const response =
        await fetch(
            url,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        body
                    )

            }
        );


    const text =
        await response.text();


    let data;


    try {

        data =
            JSON.parse(
                text
            );

    }

    catch {

        data = text;

    }


    if (!response.ok) {

        throw new Error(

            `HTTP ${response.status}: ` +

            JSON.stringify(
                data,
                null,
                2
            )

        );

    }


    return data;

}


/*
=========================================================
MAIN TEST
=========================================================
*/

async function main() {

    console.log(
        "\n========================================"
    );

    console.log(
        "ALLY AI LOCAL PIPELINE TEST"
    );

    console.log(
        "========================================"
    );


    console.log(
        "\nStudent ID:",
        studentId
    );


    /*
    =====================================================
    STEP 1
    ASSESSMENT 1
    =====================================================
    */

    console.log(
        "\n----------------------------------------"
    );

    console.log(
        "STEP 1 — ASSESSMENT 1"
    );

    console.log(
        "----------------------------------------"
    );


    const assessment1 =
        await post(

            "http://localhost:3001/api/assessment/readiness",

            {

                guest_token:
                    studentId,

                answers:
                    assessment1Answers

            }

        );


    console.log(
        JSON.stringify(
            assessment1,
            null,
            2
        )
    );


    /*
    =====================================================
    STEP 2
    ASSESSMENT 2
    =====================================================
    */

    console.log(
        "\n----------------------------------------"
    );

    console.log(
        "STEP 2 — ASSESSMENT 2"
    );

    console.log(
        "----------------------------------------"
    );


    const assessment2 =
        await post(

            "http://localhost:3001/api/assessment/deep",

            {

                answers:
                    assessment2Answers,

                uploads:
                    {}

            }

        );


    console.log(
        JSON.stringify(
            assessment2,
            null,
            2
        )
    );


    /*
    =====================================================
    Verify Assessment 2
    =====================================================
    */

    const revisedReadiness =
        assessment2
            ?.data
            ?.assessment
            ?.revised_percentage;


    const studentProfile =
        assessment2
            ?.data
            ?.student_profile;


    if (
        revisedReadiness === undefined
    ) {

        throw new Error(
            "Assessment 2 did not return revised_percentage"
        );

    }


    if (
        !studentProfile
    ) {

        throw new Error(
            "Assessment 2 did not return student_profile"
        );

    }


    console.log(
        "\nAssessment 2 readiness:",
        revisedReadiness
    );


    console.log(
        "Student profile received:",
        !!studentProfile
    );


    /*
    =====================================================
    STEP 3
    CREATE JOURNEY
    =====================================================
    */

    console.log(
        "\n----------------------------------------"
    );

    console.log(
        "STEP 3 — CREATE JOURNEY"
    );

    console.log(
        "----------------------------------------"
    );


    const journey =
        await post(

            "http://localhost:3001/api/journey",

            {

                studentId,

                answers:
                    assessment2Answers,

                uploads:
                    {},

                scholarship

            }

        );


    console.log(
        JSON.stringify(
            journey,
            null,
            2
        )
    );


    /*
    =====================================================
    VERIFY JOURNEY
    =====================================================
    */

    const finalJourney =
        journey?.journey;


    if (
        !finalJourney
    ) {

        throw new Error(
            "Journey was not returned"
        );

    }


    console.log(
        "\n========================================"
    );

    console.log(
        "PIPELINE VERIFICATION"
    );

    console.log(
        "========================================"
    );


    console.log(
        "Assessment 1:",
        assessment1?.status
    );


    console.log(
        "Assessment 2:",
        assessment2?.status
    );


    console.log(
        "Assessment 2 readiness:",
        revisedReadiness
    );


    console.log(
        "Journey:",
        journey?.success
    );


    console.log(
        "Journey readiness:",
        finalJourney?.readiness
    );


    console.log(
        "Assessment number:",
        finalJourney
            ?.assessment
            ?.assessment_number
    );


    console.log(
        "Revised percentage:",
        finalJourney
            ?.assessment
            ?.revised_percentage
    );


    console.log(
        "Timeline:",
        !!finalJourney?.timeline
    );


    console.log(
        "Valleys:",
        Array.isArray(
            finalJourney?.valleys
        )
            ? finalJourney.valleys.length
            : "not found"
    );


    console.log(
        "========================================"
    );


    /*
    =====================================================
    FINAL ASSERTIONS
    =====================================================
    */

    if (
        assessment1?.status !==
        "success"
    ) {

        throw new Error(
            "Assessment 1 failed"
        );

    }


    if (
        assessment2?.status !==
        "success"
    ) {

        throw new Error(
            "Assessment 2 failed"
        );

    }


    if (
        finalJourney?.readiness !==
        Number(
            revisedReadiness
        )
    ) {

        throw new Error(
            "Journey readiness does not match Assessment 2 readiness"
        );

    }


    if (
        finalJourney
            ?.assessment
            ?.assessment_number !== 2
    ) {

        throw new Error(
            "Journey assessment number is not 2"
        );

    }


    if (
        finalJourney
            ?.assessment
            ?.revised_percentage !==
        Number(
            revisedReadiness
        )
    ) {

        throw new Error(
            "Journey revised percentage does not match Assessment 2"
        );

    }


    console.log(
        "\n✅ FULL LOCAL PIPELINE PASSED"
    );

    console.log(
        "Assessment 1 → Assessment 2 → Journey → Timeline"
    );

}


main()
    .catch(
        error => {

            console.error(
                "\n❌ FULL LOCAL PIPELINE FAILED"
            );

            console.error(
                error
            );

            process.exit(1);

        }
    );