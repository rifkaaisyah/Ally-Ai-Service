const {
    generateScholarshipQuery
} = require("./queryGenerator");


const profile = {

    education_level:
        "Final year Bachelor student",

    academic_profile:{
        academic_strength:
            "Excellent",

        gpa_range:
            "3.75-4.00"
    },

    study_field:
        "Engineering",

    master_direction:
        "same_field",

    leadership:
        "Strong leadership experience",

    impact:
        "Created social impact",

    english:
        "English proficiency ready",

    application_readiness:{
        cv:"needs_improvement",
        essay:"unfinished"
    }

};



const query =
    generateScholarshipQuery(profile);


console.log(query);