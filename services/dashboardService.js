const { analyzeDeepAssessment } = require("./deepAssessmentService");

/**
 * Dashboard Service
 * Combines all AI outputs into one response.
 *
 * Current version:
 * - Deep Assessment
 *
 * Future:
 * - Scholarship Matching
 * - Roadmap
 * - Progress
 * - Insights
 */

function generateDashboard(data) {

    const {
        answers,
        uploads = {}
    } = data;

    // 1. Analyze Deep Assessment
    const deepAssessment =
        analyzeDeepAssessment(
            answers,
            uploads
        );

    // 2. Dashboard Summary
    const dashboard = {

        completion_percentage:
            deepAssessment.assessment.revised_percentage,

        next_step:
            deepAssessment.assessment.suggestion,

        readiness_level:
            getReadinessLevel(
                deepAssessment.assessment.revised_percentage
            )

    };

    return {

        assessment:
            deepAssessment.assessment,

        profile:
            deepAssessment.profile,

        dashboard

    };

}

function getReadinessLevel(score){

    if(score >= 85){

        return "Highly Competitive";

    }

    if(score >= 70){

        return "Competitive";

    }

    if(score >= 50){

        return "Developing";

    }

    return "Early Preparation";

}

module.exports = {

    generateDashboard

};