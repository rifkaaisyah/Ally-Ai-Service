const {
    calculateReadiness
} = require("./scoringEngine");


/*
=========================================================
ASSESSMENT 1 LOCAL TEST
=========================================================
*/

const weakStudentAnswers = {

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


/*
=========================================================
RUN
=========================================================
*/

try {

    const result =
        calculateReadiness(
            weakStudentAnswers
        );


    console.log(
        "\n========================================"
    );

    console.log(
        "ASSESSMENT 1 RESULT"
    );

    console.log(
        "========================================"
    );


    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );


}

catch (error) {

    console.error(
        "Assessment 1 test failed:",
        error
    );

}