function calculateDeepReadiness(profile) {

    let score = 0;

    const strengths = [];
    const improvements = [];

    const student =
        profile.student_profile;


    /*
    Academic Direction
    */

    if (
        student.academic.master_motivation
    ) {

        score += 10;

        strengths.push(
            "clear Master's motivation"
        );

    }


    if (
        student.academic.study_plan_clarity
    ) {

        const clarity =
            student.academic.study_plan_clarity.toLowerCase();


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
    Academic Experience
    */

    const academicExperience =
        student.academic.academic_experiences || [];


    if (
        academicExperience.length > 0 &&
        !academicExperience.includes("none")
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
    Project Experience
    */

    const project =
        student.academic.field_project_experience;


    if(project){

        const projectText =
            project.toLowerCase();


        if(
            projectText.includes("multiple")
        ){

            score += 10;

            strengths.push(
                "strong project portfolio"
            );

        }

        else if(
            projectText.includes("major")
        ){

            score += 8;

        }

        else if(
            projectText.includes("some")
        ){

            score += 5;

        }

        else {

            score += 2;

            improvements.push(
                "strengthen project portfolio"
            );

        }

    }



    /*
    Leadership
    */

    const leadership =
        student.leadership.experience || [];


    if(
        leadership.length > 0 &&
        !leadership.includes("none")
    ){

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
    Leadership Impact
    */

    if(
        student.leadership.impact
    ){

        const impact =
            student.leadership.impact.toLowerCase();


        if(
            impact.includes("impact") ||
            impact.includes("community") ||
            impact.includes("result")
        ){

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



    /*
    Career Direction
    */

    if(
        student.career.goal
    ){

        const goal =
            student.career.goal.toLowerCase();


        if(
            !goal.includes("exploring")
        ){

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



    /*
    Application Readiness
    */


    if(
        student.application_readiness.cv_strength
    ){

        score += 5;

    }


    if(
        student.application_readiness.essay_readiness
    ){

        score += 5;

    }


    if(
        student.application_readiness.recommendation_status
    ){

        score += 5;

    }



    /*
    Preparation Timeline
    */

    if(
        student.preparation.available_time
    ){

        score += 5;

    }



    return {

        revised_percentage:
            Math.min(score,100),

        strengths,

        improvements

    };

}



module.exports = {

    calculateDeepReadiness

};