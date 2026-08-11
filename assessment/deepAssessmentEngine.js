const {
    buildDeepProfile
} = require("./deepProfileBuilder");

const {
    calculateDeepReadiness
} = require("./deepScoringEngine");


function generateSuggestion(profile) {

    const student =
        profile.student_profile;

    const strengths = [];
    const improvements = [];


    /*
    Strengths
    */

    if (
        student.career.goal
    ) {

        strengths.push(
            "you have a clear career direction"
        );

    }


    if (
        student.academic.academic_experiences &&
        student.academic.academic_experiences.length > 0
    ) {

        strengths.push(
            "you have academic experience supporting your Master's goal"
        );

    }


    if (
        student.leadership.experience &&
        student.leadership.experience.length > 0
    ) {

        strengths.push(
            "you have leadership experience"
        );

    }


    /*
    Improvements
    */

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


    /*
    Evidence
    */

    if (
        student.academic.evidence &&
        student.academic.evidence.academic === null &&
        student.academic.evidence.projects === null
    ) {

        improvements.push(
            "collect academic and project evidence to strengthen your application"
        );

    }


    /*
    Leadership impact
    */

    if (
        student.leadership.impact &&
        !student.leadership.impact.match(/\d+/)
    ) {

        improvements.push(
            "quantify your leadership impact with measurable results"
        );

    }


    /*
    CV improvement
    */

    if (
        student.application_readiness.cv_strength ===
        "good_needs_improvement"
    ) {

        improvements.push(
            "upgrade your CV by highlighting achievements and measurable outcomes"
        );

    }


    /*
    Build suggestion
    */

    let suggestion =
        "Based on your deep assessment, ";


    if (strengths.length > 0) {

        suggestion +=
            strengths.join(", ") + ". ";

    }


    if (improvements.length > 0) {

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


/*
    Assessment 2 orchestration

    Input:
        answers
        uploads

    Process:
        answers
            ↓
        deep profile
            ↓
        deep scoring
            ↓
        suggestions

    Output:
        Assessment 2 result
*/


function analyzeDeepAssessment(
    answers,
    uploads = {}
) {

    const profile =
        buildDeepProfile(
            answers,
            uploads
        );


    const readiness =
        calculateDeepReadiness(
            profile
        );


    const suggestion =
        generateSuggestion(
            profile
        );


    return {

        assessment: {

            assessment_number: 2,

            revised_percentage:
                readiness.revised_percentage,

            strengths:
                readiness.strengths,

            improvements:
                readiness.improvements,

            suggestion

        },

        profile

    };

}


module.exports = {
    analyzeDeepAssessment
};