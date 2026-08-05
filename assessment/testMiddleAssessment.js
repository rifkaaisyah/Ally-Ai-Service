const {
    calculateReadiness
} = require("./scoringEngine");


const middleStudentAnswers = {

    q1_current_status: "recent_graduate",

    q2_gpa_range: "3.00-3.49",

    q3_undergraduate_field: "computer_science",

    q4_master_interest: "related_field",

    q5_scholarship_direction: "some_options",

    q6_application_timeline: "3-6_months",

    q7_leadership_experience: "contributed_organization",

    q8_impact_experience: "participated_impact_project",

    q9_recognized_programs: "university_level",

    q10_achievements: "some_achievements",

    q11_skill_profile: "some_developed_skills",

    q12_english_certificate: "preparing",

    q13_storytelling_confidence: "somewhat_confident",

    q14_cv_status: "basic_cv",

    q15_essay_status: "started_unfinished",

    q16_application_knowledge: "some_understanding",

    q17_previous_application: "first_application",

    q18_rejection_analysis: "not_applicable",

    q19_biggest_challenge: "not_knowing_scholarship_fit",

    q20_cv_upload: false

};



const result =
    calculateReadiness(
        middleStudentAnswers
    );


console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);