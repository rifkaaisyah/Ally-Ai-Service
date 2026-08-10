function adaptAssessmentProfile(profile) {

    // Support both formats:
    // 1. buildDeepProfile() -> { student_profile: {...} }
    // 2. already flattened profile -> { academic: {...} }

    const student =
        profile.student_profile || profile;

    return {

        nationality:
            student.nationality || "Indonesia",

        study_field:
            student.academic?.study_direction ||
            student.career?.contribution_area ||
            "General",

        target_degree:
            "Master",

        leadership:
            !!(
                student.leadership?.experience &&
                student.leadership.experience.length > 0
            ),

        impact:
            !!student.leadership?.impact,

        english:
            student.english || "Not ready",

        academic_profile: {

            academic_strength:
                student.academic?.academic_strength ||
                "Average"

        },

        work_experience_years:
            student.work_experience_years || 0,

        application_readiness: {

            cv:
                student.application_readiness?.cv_strength ||
                "needs_improvement",

            essay:
                student.application_readiness?.essay_readiness ||
                "not_started"

        },

        scholarship_preferences:
            student.scholarship_preferences || {}

    };

}

module.exports = {
    adaptAssessmentProfile
};