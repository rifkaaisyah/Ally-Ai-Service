function buildStudentProfile(answers) {

    return {

        education_level:
            mapEducationLevel(
                answers.q1_current_status
            ),


        academic_profile: {

            gpa_range:
                answers.q2_gpa_range,

            academic_strength:
                mapAcademicStrength(
                    answers.q2_gpa_range
                )

        },


        study_field:
            mapField(
                answers.q3_undergraduate_field
            ),


       master_direction:
    mapMasterDirection(
        answers.q4_master_interest
    ),


        scholarship_direction:
            answers.q5_scholarship_direction,


        leadership:

            mapLeadership(
                answers.q7_leadership_experience
            ),



        impact:

            mapImpact(
                answers.q8_impact_experience
            ),



        english:

            mapEnglish(
                answers.q12_english_certificate
            ),



        application_readiness: {

            cv:
                answers.q14_cv_status,

            essay:
                answers.q15_essay_status

        },


        biggest_challenge:
            answers.q19_biggest_challenge

    };

}




function mapEducationLevel(status) {


    const mapping = {

        currently_studying_undergraduate:
            "Bachelor student",

        final_year_undergraduate:
            "Final year Bachelor student",

        recently_graduated:
            "Bachelor graduate",

        working_professional:
            "Working professional"

    };


    return mapping[status] || "Unknown";

}




function mapAcademicStrength(gpa) {


    const mapping = {

        "3.75-4.00":
            "Excellent",

        "3.50-3.74":
            "Strong",

        "3.00-3.49":
            "Moderate",

        "2.50-2.99":
            "Needs Improvement",

        "Below 2.50":
            "Weak"

    };


    return mapping[gpa] || "Unknown";

}




function mapField(field) {


    const mapping = {


        computer_science:
            "Computer Science",


        engineering:
            "Engineering",


        business_economics:
            "Business and Economics",


        natural_science:
            "Natural Science",


        social_science:
            "Social Science",


        arts_humanities:
            "Arts and Humanities"


    };


    return mapping[field] || "Other";

}
function mapMasterDirection(value) {


    const mapping = {


        same_field:
            "Continue studying the same field as undergraduate degree",


        related_field:
            "Continue into a related academic field",


        different_field:
            "Switch into a different academic field",


        still_exploring:
            "Still exploring possible Master's fields"


    };


    return mapping[value] || "Unknown";


}



function mapLeadership(value) {


    const mapping = {


        led_team:
            "Strong leadership experience",


        contributed_organization:
            "Organization involvement",


        participated:
            "Limited leadership experience",


        not_yet:
            "No leadership experience yet"


    };


    return mapping[value] || "Unknown";

}




function mapImpact(value) {


    const mapping = {


        led_impact_project:
            "Created social impact",


        participated_impact_project:
            "Participated in impact activities",


        volunteered:
            "Volunteer experience",


        not_yet:
            "No impact experience yet"


    };


    return mapping[value] || "Unknown";

}




function mapEnglish(value) {


    const mapping = {


        competitive_score:
            "English proficiency ready",


        improve_score:
            "Has certificate but can improve",


        preparing:
            "Currently preparing",


        not_yet:
            "No English certification"


    };


    return mapping[value] || "Unknown";

}



module.exports = {

    buildStudentProfile

};