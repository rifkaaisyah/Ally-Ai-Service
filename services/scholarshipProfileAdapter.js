function adaptDeepProfile(profile){

    const student = profile.student_profile;

    return {

        nationality: "Indonesia",

        study_field:
            student.career.contribution_area || "",

        target_degree: "Master",

        leadership:
            student.leadership.experience.length > 0,

        impact:
            !!student.leadership.impact,

        english:
            "Unknown",

        work_experience_years: 0,

        academic_profile:{

            academic_strength:
                student.academic.academic_experiences.length > 0
                    ? "Excellent"
                    : "Average"

        }

    };

}

module.exports = {

    adaptDeepProfile

};