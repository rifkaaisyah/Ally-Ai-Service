const {
    analyzeDeepAssessment
} = require("../services/deepAssessmentService");

const answers = {

    q2_master_motivation:
        "I want to pursue a master's degree in AI.",

    q3_master_plan_clarity:
        "Very Clear",

    q4_academic_experience: [
        "research_experience"
    ],

    q5_academic_achievement_description:
        "Published one paper.",

    q6_field_project_experience:
        "Built an AI application.",

    q7_leadership_experience: [
        "Student Organization"
    ],

    q8_leadership_responsibility:
        "Project Leader",

    q9_leadership_impact:
        "Led 20 members.",

    q10_career_goal:
        "AI Researcher",

    q11_career_contribution_area:
        "Artificial Intelligence",

    q12_target_countries: [
        "Japan",
        "Germany"
    ],

    q13_scholarship_type:
        "Fully Funded",

    q14_scholarship_priority: [
        "Research"
    ],

    q15_cv_strength:
        "Good",

    q16_essay_readiness:
        "Draft Ready",

    q17_recommendation_availability:
        "Available",

    q18_preparation_time:
        "10 hours/week",

    q19_application_deadline_target:
        "6 months",

    q20_support_needed: [
        "Essay Review"
    ]

};

const result =
    analyzeDeepAssessment(
        answers
    );

console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);