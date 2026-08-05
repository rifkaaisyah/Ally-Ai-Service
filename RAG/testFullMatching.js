const {
    getScholarshipRecommendation
} = require("./ragService");


async function test(){

    const fakeStudentProfile = {
         nationality:
        "Indonesian",


        education_level:
            "Final year Bachelor student",



        academic_profile: {

            gpa_range:
                "3.75-4.00",

            academic_strength:
                "Excellent"

        },


        study_field:
            "Engineering",


        master_direction:
            "Continue studying the same field as undergraduate degree",


        scholarship_direction:
            "some_options",


        leadership:
            "Strong leadership experience",


        impact:
            "Created social impact",


        english:
            "English proficiency ready",


        application_readiness: {

            cv:
                "needs_improvement",

            essay:
                "unfinished"

        },


        biggest_challenge:
            "essay_cv"

    };


    const result =
        await getScholarshipRecommendation(
            fakeStudentProfile
        );


    console.log(
        "\nALLY RESPONSE:\n"
    );


    console.log(result);

}


test();