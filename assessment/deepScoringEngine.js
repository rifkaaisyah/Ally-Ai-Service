function calculateDeepReadiness(profile) {

    let score = 0;

    const strengths = [];
    const improvements = [];

    const student =
        profile?.student_profile;


    if (!student) {

        throw new Error(
            "Student profile is required for deep readiness calculation"
        );

    }


    /*
     * ==========================================
     * ACADEMIC DIRECTION
     * Maximum: 20
     * ==========================================
     */

    if (
        student.academic?.master_motivation
    ) {

        score += 10;

        strengths.push(
            "clear Master's motivation"
        );

    }


    if (
        student.academic?.study_plan_clarity
    ) {

        const clarity =
            String(
                student.academic.study_plan_clarity
            ).toLowerCase();


        if (
            clarity.includes("exact") ||
            clarity.includes("clear")
        ) {

            score += 10;

            strengths.push(
                "clear study plan direction"
            );

        }
        else {

            score += 5;

            improvements.push(
                "develop a more specific Master's study plan"
            );

        }

    }


    /*
     * ==========================================
     * ACADEMIC EXPERIENCE
     * Maximum: 15
     * ==========================================
     */

    const academicExperience =
        student.academic?.academic_experiences || [];


    const academicExperienceList =
        Array.isArray(academicExperience)
            ? academicExperience
            : [academicExperience];


    if (
        academicExperienceList.length > 0 &&
        !academicExperienceList.some(
            experience =>
                String(experience)
                    .toLowerCase()
                    .includes("none")
        )
    ) {

        score += 15;

        strengths.push(
            "academic experience"
        );

    }
    else {

        score += 5;

        improvements.push(
            "build stronger academic evidence"
        );

    }


    /*
     * ==========================================
     * PROJECT EXPERIENCE
     * Maximum: 10
     * ==========================================
     */

    const project =
        student.academic?.field_project_experience;


    if (project) {

        const projectText =
            String(project).toLowerCase();


        if (
            projectText.includes("multiple")
        ) {

            score += 10;

            strengths.push(
                "strong project portfolio"
            );

        }

        else if (
            projectText.includes("major")
        ) {

            score += 8;

            strengths.push(
                "substantial project experience"
            );

        }

        else if (
            projectText.includes("some")
        ) {

            score += 5;

            strengths.push(
                "project experience"
            );

        }

        else {

            score += 2;

            improvements.push(
                "strengthen project portfolio"
            );

        }

    }
    else {

        improvements.push(
            "strengthen project portfolio"
        );

    }


    /*
     * ==========================================
     * LEADERSHIP
     * Maximum: 15
     * ==========================================
     */

    const leadership =
        student.leadership?.experience || [];


    const leadershipList =
        Array.isArray(leadership)
            ? leadership
            : [leadership];


    if (
        leadershipList.length > 0 &&
        !leadershipList.some(
            experience =>
                String(experience)
                    .toLowerCase()
                    .includes("none")
        )
    ) {

        score += 15;

        strengths.push(
            "leadership experience"
        );

    }
    else {

        score += 5;

        improvements.push(
            "gain leadership experience"
        );

    }


    /*
     * ==========================================
     * LEADERSHIP IMPACT
     * Maximum: 5
     * ==========================================
     */

    if (
        student.leadership?.impact
    ) {

        const impact =
            String(
                student.leadership.impact
            ).toLowerCase();


        if (
            impact.includes("impact") ||
            impact.includes("community") ||
            impact.includes("result")
        ) {

            score += 5;

            strengths.push(
                "demonstrated impact"
            );

        }
        else {

            score += 2;

            improvements.push(
                "document measurable impact"
            );

        }

    }
    else {

        improvements.push(
            "document your leadership impact"
        );

    }


    /*
     * ==========================================
     * CAREER DIRECTION
     * Maximum: 10
     * ==========================================
     */

    if (
        student.career?.goal
    ) {

        const goal =
            String(
                student.career.goal
            ).toLowerCase();


        if (
            !goal.includes("exploring")
        ) {

            score += 10;

            strengths.push(
                "clear career direction"
            );

        }
        else {

            score += 5;

            improvements.push(
                "clarify career goals"
            );

        }

    }
    else {

        improvements.push(
            "clarify your career direction"
        );

    }


    /*
     * ==========================================
     * APPLICATION READINESS
     * Maximum: 15
     * ==========================================
     */

    if (
        student.application_readiness?.cv_strength
    ) {

        score += 5;

    }
    else {

        improvements.push(
            "strengthen your CV"
        );

    }


    if (
        student.application_readiness?.essay_readiness
    ) {

        score += 5;

    }
    else {

        improvements.push(
            "develop your scholarship essay story"
        );

    }


    if (
        student.application_readiness?.recommendation_status
    ) {

        score += 5;

    }
    else {

        improvements.push(
            "start preparing recommendation letters"
        );

    }


    /*
     * ==========================================
     * PREPARATION TIMELINE
     * Maximum: 5
     * ==========================================
     */

    if (
        student.preparation?.available_time
    ) {

        score += 5;

    }
    else {

        improvements.push(
            "plan enough preparation time before the application deadline"
        );

    }


    /*
     * ==========================================
     * FINAL READINESS
     *
     * We intentionally cap readiness at 95%.
     *
     * 95% = very strong preparation.
     * 100% is intentionally not awarded.
     * ==========================================
     */

    const revised_percentage =
        Math.min(
            score,
            95
        );


    /*
     * Remove duplicate suggestions.
     */

    const uniqueStrengths =
        [...new Set(strengths)];


    const uniqueImprovements =
        [...new Set(improvements)];


    return {

        revised_percentage,

        strengths:
            uniqueStrengths,

        improvements:
            uniqueImprovements

    };

}


module.exports = {

    calculateDeepReadiness

};