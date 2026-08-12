const { normalizeAnswers } = require("./answerNormalizer");
const { calculateReadiness } = require("./scoringEngine");

const answers = {
    q1_current_status: "Recently graduated from undergraduate degree",
    q2_gpa_range: "3.75 - 4.00",
    q3_undergraduate_field: "Computer Science / Information Technology",
    q4_master_interest: "A related field",
    q5_scholarship_direction: "Yes, I know the specific scholarship I want",
    q6_application_timeline: "Within 3-6 months",
    q7_leadership_experience: "Yes, I have led a team or project",
    q8_impact_experience: "Yes, I created or led an impact project",
    q9_recognized_programs: "Yes, international level",
    q10_achievements: "Yes, multiple significant achievements",
    q11_skill_profile: "Strong skill portfolio with evidence",
    q12_english_certificate: "Yes, with a competitive score",
    q13_storytelling_confidence:
        "Very confident, I can clearly explain my experiences and goals",
    q14_cv_status: "Yes, updated and scholarship-ready",
    q15_essay_status: "Yes, completed and reviewed",
    q16_application_knowledge:
        "I understand the requirements and application process",
    q17_previous_application:
        "Yes, and I want to apply more for now",
    q18_rejection_analysis:
        "Yes, I know what I need to improve",
    q19_biggest_challenge:
        "I do not know if my profile is competitive enough",
    q20_cv_upload:
        "Highlighting leadership and community impact"
};

const normalized = normalizeAnswers(answers);

console.log("\nNORMALIZED ANSWERS:\n");
console.log(JSON.stringify(normalized, null, 2));

const result = calculateReadiness(normalized);

console.log("\nRESULT:\n");
console.log(JSON.stringify(result, null, 2));