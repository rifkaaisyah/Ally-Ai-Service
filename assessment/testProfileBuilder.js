const {
    buildStudentProfile
} = require("./profileBuilder");


const studentAnswers = {

    q1_current_status:
        "final_year_undergraduate",

    q2_gpa_range:
        "3.75-4.00",

    q3_undergraduate_field:
        "engineering",

    q4_master_interest:
        "same_field",

    q5_scholarship_direction:
        "some_options",

    q7_leadership_experience:
        "led_team",

    q8_impact_experience:
        "led_impact_project",

    q12_english_certificate:
        "competitive_score",

    q14_cv_status:
        "needs_improvement",

    q15_essay_status:
        "unfinished",

    q19_biggest_challenge:
        "essay_cv"

};



const profile =
    buildStudentProfile(
        studentAnswers
    );


console.log(
    JSON.stringify(
        profile,
        null,
        2
    )
);