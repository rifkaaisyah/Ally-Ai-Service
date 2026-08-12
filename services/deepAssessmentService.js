const {
    buildDeepProfile
} = require("../assessment/deepProfileBuilder");

const {
    getScholarshipRecommendation
} = require("../RAG/ragService");


/*
=========================================================
CALCULATE REVISED READINESS
=========================================================

Assessment 2 readiness is calculated from the
student's deep profile.

Maximum = 100
=========================================================
*/

function calculateRevisedReadiness(profile) {

    let score = 0;


    /*
    -----------------------------------------------------
    Validate profile
    -----------------------------------------------------
    */

    if (
        !profile ||
        !profile.student_profile
    ) {

        throw new Error(
            "Student profile is required for readiness calculation"
        );

    }


    const student =
        profile.student_profile;


    /*
    =====================================================
    ACADEMIC STRENGTH
    Maximum: 25
    =====================================================
    */

    if (
        student.academic?.master_motivation
    ) {

        score += 5;

    }


    if (
        student.academic?.study_plan_clarity ===
            "Very Clear" ||

        student.academic?.study_plan_clarity ===
            "exact_program_university"
    ) {

        score += 10;

    }

    else if (
        student.academic?.study_plan_clarity
    ) {

        score += 5;

    }


    if (
        Array.isArray(
            student.academic?.academic_experiences
        ) &&

        student.academic
            .academic_experiences
            .length > 0
    ) {

        score += 10;

    }


    /*
    =====================================================
    RESEARCH / PROJECT EVIDENCE
    Maximum: 15
    =====================================================
    */

    if (
        student.academic?.academic_achievement
    ) {

        score += 5;

    }


    if (
        student.academic?.field_project_experience
    ) {

        const projectExperience =
            String(
                student.academic
                    .field_project_experience
            )
            .toLowerCase();


        if (
            projectExperience.includes(
                "multiple"
            )
        ) {

            score += 10;

        }

        else {

            score += 7;

        }

    }


    /*
    =====================================================
    LEADERSHIP AND IMPACT
    Maximum: 15
    =====================================================
    */

    if (
        Array.isArray(
            student.leadership?.experience
        ) &&

        student.leadership
            .experience
            .length > 0
    ) {

        score += 8;

    }


    if (
        student.leadership?.impact
    ) {

        score += 7;

    }


    /*
    =====================================================
    CAREER DIRECTION
    Maximum: 15
    =====================================================
    */

    if (
        student.career?.goal
    ) {

        score += 10;

    }


    if (
        student.career?.contribution_area
    ) {

        score += 5;

    }


    /*
    =====================================================
    APPLICATION READINESS
    Maximum: 20
    =====================================================
    */

    switch (
        student.application_readiness
            ?.cv_strength
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
        student.application_readiness
            ?.essay_readiness
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
        student.application_readiness
            ?.recommendation_status
    ) {

        score += 5;

    }


    /*
    -----------------------------------------------------
    Return maximum 100
    -----------------------------------------------------
    */

    return Math.min(
        score,
        100
    );

}


/*
=========================================================
GENERATE DEEP ASSESSMENT SUGGESTION
=========================================================
*/

function generateSuggestion(profile) {

    const student =
        profile.student_profile;


    const strengths = [];

    const improvements = [];


    /*
    -----------------------------------------------------
    Strengths
    -----------------------------------------------------
    */

    if (
        student.career?.goal
    ) {

        strengths.push(
            "you have a clear career direction"
        );

    }


    if (
        Array.isArray(
            student.academic
                ?.academic_experiences
        ) &&

        student.academic
            .academic_experiences
            .length > 0
    ) {

        strengths.push(
            "you have academic experience supporting your Master's goal"
        );

    }


    if (
        Array.isArray(
            student.leadership?.experience
        ) &&

        student.leadership
            .experience
            .length > 0
    ) {

        strengths.push(
            "you have leadership experience"
        );

    }


    /*
    -----------------------------------------------------
    Improvements
    -----------------------------------------------------
    */

    if (
        !student.academic
            ?.field_project_experience
    ) {

        improvements.push(
            "strengthen your project portfolio"
        );

    }


    if (
        !student.application_readiness
            ?.recommendation_status
    ) {

        improvements.push(
            "start preparing recommendation letters"
        );

    }


    if (
        !student.application_readiness
            ?.essay_readiness
    ) {

        improvements.push(
            "develop your scholarship essay story"
        );

    }


    /*
    -----------------------------------------------------
    Academic/project evidence
    -----------------------------------------------------
    */

    if (
        student.academic?.evidence?.academic === null &&

        student.academic?.evidence?.projects === null
    ) {

        improvements.push(
            "collect academic and project evidence to strengthen your application"
        );

    }


    /*
    -----------------------------------------------------
    Leadership impact
    -----------------------------------------------------
    */

    if (
        student.leadership?.impact &&

        !String(
            student.leadership.impact
        ).match(/\d+/)
    ) {

        improvements.push(
            "quantify your leadership impact with measurable results"
        );

    }


    /*
    -----------------------------------------------------
    CV improvement
    -----------------------------------------------------
    */

    if (
        student.application_readiness
            ?.cv_strength === "Good"
    ) {

        improvements.push(
            "upgrade your CV by highlighting achievements and measurable outcomes"
        );

    }


    /*
    -----------------------------------------------------
    Build suggestion
    -----------------------------------------------------
    */

    let suggestion =
        "Based on your deep assessment, ";


    if (
        strengths.length > 0
    ) {

        suggestion +=
            strengths.join(", ") +
            ". ";

    }


    if (
        improvements.length > 0
    ) {

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
=========================================================
ANALYZE DEEP ASSESSMENT
=========================================================
*/

async function analyzeDeepAssessment(
    answers,
    uploads = {}
) {

    /*
    -----------------------------------------------------
    Validate answers
    -----------------------------------------------------
    */

    if (!answers) {

        throw new Error(
            "Assessment answers are required"
        );

    }


    /*
    =====================================================
    1. BUILD STUDENT PROFILE
    =====================================================
    */

    const profile =
        buildDeepProfile(
            answers,
            uploads
        );


    if (
        !profile ||
        !profile.student_profile
    ) {

        throw new Error(
            "Failed to build student profile"
        );

    }


    /*
    =====================================================
    2. CALCULATE REVISED READINESS
    =====================================================
    */

    const revised_percentage =
        calculateRevisedReadiness(
            profile
        );


    /*
    =====================================================
    3. GENERATE SUGGESTION
    =====================================================
    */

    const suggestion =
        generateSuggestion(
            profile
        );


    /*
    =====================================================
    4. GET SCHOLARSHIP RECOMMENDATION
    =====================================================
    */

    const scholarshipResult =
        await getScholarshipRecommendation(
            profile
        );


    /*
    =====================================================
    5. EXTRACT RECOMMENDATION
    =====================================================
    */

    const beasiswa_recomendation =
        scholarshipResult
            ?.beasiswa_recomendation ||
        null;


    /*
    =====================================================
    6. RETURN COMPLETE RESULT
    =====================================================
    */

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

    analyzeDeepAssessment,

    calculateRevisedReadiness,

    generateSuggestion

};