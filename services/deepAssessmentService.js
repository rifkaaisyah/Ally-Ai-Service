const {
    buildDeepProfile
} = require("../assessment/deepProfileBuilder");

const {
    getScholarshipRecommendation
} = require("../RAG/ragService");



function calculateRevisedReadiness(profile) {

    let score = 0;

    const student = profile.student_profile;


    /*
    Academic Strength
    Maximum: 25
    */

    if (student.academic.master_motivation) {
        score += 5;
    }


    if (
        student.academic.study_plan_clarity === "Very Clear" ||
        student.academic.study_plan_clarity === "exact_program_university"
    ) {
        score += 10;
    }
    else if (student.academic.study_plan_clarity) {
        score += 5;
    }


    if (
        student.academic.academic_experiences &&
        student.academic.academic_experiences.length > 0
    ) {
        score += 10;
    }



    /*
    Research / Project Evidence
    Maximum: 15
    */

    if (student.academic.academic_achievement) {
        score += 5;
    }


    if (student.academic.field_project_experience) {

        if (
            student.academic.field_project_experience.includes("multiple")
        ) {
            score += 10;
        }
        else {
            score += 7;
        }

    }



    /*
    Leadership and Impact
    Maximum: 15
    */

    if (
        student.leadership.experience &&
        student.leadership.experience.length > 0
    ) {
        score += 8;
    }


    if (student.leadership.impact) {
        score += 7;
    }



    /*
    Career Direction
    Maximum: 15
    */

    if (student.career.goal) {
        score += 10;
    }


    if (student.career.contribution_area) {
        score += 5;
    }



    /*
    Application Readiness
    Maximum: 20
    */

    switch (
        student.application_readiness.cv_strength
    ) {

        case "achievement_based":
            score += 8;
            break;

        case "good_needs_improvement":
        case "Good":
            score += 5;
            break;

        case "basic":
            score += 3;
            break;

    }



    switch (
        student.application_readiness.essay_readiness
    ) {

        case "clear_story":
        case "Draft Ready":
            score += 7;
            break;

        case "needs_structure":
            score += 4;
            break;

    }



    if (
        student.application_readiness.recommendation_status
    ) {
        score += 5;
    }


    return Math.min(score, 100);
}



function generateSuggestion(profile) {

    const student = profile.student_profile;


    const strengths = [];
    const improvements = [];


    if (student.career.goal) {

        strengths.push(
            "you have a clear career direction"
        );

    }



    if (
        student.academic.academic_experiences.length > 0
    ) {

        strengths.push(
            "you have academic experience supporting your Master's goal"
        );

    }



    if (
        student.leadership.experience.length > 0
    ) {

        strengths.push(
            "you have leadership experience"
        );

    }



    if (
        !student.academic.field_project_experience
    ) {

        improvements.push(
            "strengthen your project portfolio"
        );

    }



    if (
        !student.application_readiness.recommendation_status
    ) {

        improvements.push(
            "start preparing recommendation letters"
        );

    }



    if (
        !student.application_readiness.essay_readiness
    ) {

        improvements.push(
            "develop your scholarship essay story"
        );

    }



    let suggestion =
        "Based on your deep assessment, ";



    if (strengths.length) {

        suggestion +=
            strengths.join(", ") + ". ";

    }



    /*
    Advanced improvement suggestions
    */

    if (
        student.academic.evidence.academic === null &&
        student.academic.evidence.projects === null
    ) {

        improvements.push(
            "collect academic and project evidence to strengthen your application"
        );

    }



    if (
        student.leadership.impact &&
        !student.leadership.impact.match(/\d+/)
    ) {

        improvements.push(
            "quantify your leadership impact with measurable results"
        );

    }



    if (
        student.application_readiness.cv_strength === "Good"
    ) {

        improvements.push(
            "upgrade your CV by highlighting achievements and measurable outcomes"
        );

    }



    if (improvements.length) {

        suggestion +=
            "To improve your scholarship readiness, " +
            improvements.join(", ") +
            ".";

    }
    else {

        suggestion +=
            "you have a strong foundation for scholarship preparation.";

    }



    return suggestion;
}



async function analyzeDeepAssessment(
    answers,
    uploads = {}
) {

    /*
    Build the student's deep assessment profile
    */

    const profile =
        buildDeepProfile(
            answers,
            uploads
        );



    /*
    Calculate individual scholarship readiness
    */

    const revised_percentage =
        calculateRevisedReadiness(
            profile
        );



    /*
    Generate individual readiness suggestion
    */

    const suggestion =
        generateSuggestion(
            profile
        );



    /*
    Get the scholarship recommendation
    from the existing RAG system.

    The RAG already returns ONE recommendation
    under the key:

        beasiswa_recomendation
    */

    const scholarshipResult =
        await getScholarshipRecommendation(
            profile
        );



    /*
    Keep the exact recommendation returned
    by the RAG system.
    */

    const beasiswa_recomendation =
        scholarshipResult?.beasiswa_recomendation || null;



    return {

        assessment: {

            revised_percentage,

            suggestion,

            beasiswa_recomendation

        },


        profile

    };
}



module.exports = {

    analyzeDeepAssessment

};