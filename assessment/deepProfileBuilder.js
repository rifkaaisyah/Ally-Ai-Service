function normalizeList(value) {

    if (Array.isArray(value)) {

        return value;

    }

    if (
        typeof value === "string" &&
        value.trim()
    ) {

        return [
            value.trim()
        ];

    }

    return [];

}


function buildDeepProfile(
    answers,
    uploads = {}
) {

    const profile = {

        academic: {

            master_motivation:
                answers.q2_master_motivation || null,

            study_plan_clarity:
                answers.q3_master_plan_clarity || null,

            academic_experiences:
                normalizeList(
                    answers.q4_academic_experience
                ),

            academic_achievement:
                answers.q5_academic_achievement_description ||
                null,

            field_project_experience:
                answers.q6_field_project_experience ||
                null,

            evidence: {

                academic:
                    uploads.q4_academic_evidence_upload ||
                    null,

                projects:
                    uploads.q6_project_evidence_upload ||
                    null

            }

        },


        leadership: {

            experience:
                normalizeList(
                    answers.q7_leadership_experience
                ),

            responsibility:
                answers.q8_leadership_responsibility ||
                null,

            impact:
                answers.q9_leadership_impact ||
                null

        },


        career: {

            goal:
                answers.q10_career_goal ||
                null,

            contribution_area:
                answers.q11_career_contribution_area ||
                null

        },


        scholarship_preferences: {

            target_countries:
                normalizeList(
                    answers.q12_target_countries
                ),

            scholarship_type:
                answers.q13_scholarship_type ||
                null,

            priority_factors:
                normalizeList(
                    answers.q14_scholarship_priority
                )

        },


        application_readiness: {

            cv_strength:
                answers.q15_cv_strength ||
                null,

            essay_readiness:
                answers.q16_essay_readiness ||
                null,

            recommendation_status:
                answers.q17_recommendation_availability ||
                null

        },


        preparation: {

            available_time:
                answers.q18_preparation_time ||
                null,

            target_application_time:
                answers.q19_application_deadline_target ||
                null

        },


        ally_support: {

            requested_support:
                normalizeList(
                    answers.q20_support_needed
                )

        }

    };


    return {

        student_profile:
            profile

    };

}


module.exports = {

    buildDeepProfile

};