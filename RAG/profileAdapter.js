function adaptAssessmentProfile(
    deepProfile
) {


    return {


        nationality:
            deepProfile.nationality || "Indonesia",



        study_field:
            deepProfile.academic?.study_direction
            ||
            "General",



        target_degree:
            "Master",



        leadership:
            !!deepProfile.leadership?.experience,



        impact:
            !!deepProfile.leadership?.impact,



        english:
            deepProfile.english
            ||
            "Not ready",



        academic_profile: {

            academic_strength:
                deepProfile.academic?.academic_strength
                ||
                "Average"

        },



        work_experience_years:
            deepProfile.work_experience_years || 0,



        application_readiness: {

            cv:
                deepProfile.application_readiness?.cv
                ||
                "needs_improvement",


            essay:
                deepProfile.application_readiness?.essay
                ||
                "not_started"

        },


        scholarship_preferences:
            deepProfile.scholarship_preferences || {}

    };

}



module.exports = {

    adaptAssessmentProfile

};