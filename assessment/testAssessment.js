const {
    calculateReadiness
} = require("./scoringEngine");


const studentAnswers = {

    q1_current_status: "final_year_undergraduate",

    q2_gpa_range: "3.75-4.00",

    q3_undergraduate_field: "engineering",

    q4_master_interest: "same_field",

    q5_scholarship_direction: "some_options",

    q6_application_timeline: "6-12_months",

    q7_leadership_experience: "led_team",

    q8_impact_experience: "led_impact_project",

    q9_recognized_programs: "national_level",

    q10_achievements: "multiple_significant",

    q11_skill_profile: "strong_with_evidence",

    q12_english_certificate: "competitive_score",

    q13_storytelling_confidence: "somewhat_confident",

    q14_cv_status: "needs_improvement",

    q15_essay_status: "unfinished",

    q16_application_knowledge: "some_understanding",

    q17_previous_application: "first_application",

    q18_rejection_analysis: "not_applicable",

    q19_biggest_challenge: "essay_cv",

    q20_cv_upload: false

};



const result =
    calculateReadiness(studentAnswers);



console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);