const {
    generateRoadmap
} = require("../services/roadmapService");


const profile = {

    academic: {

        academic_experiences: [

            "research_experience",

            "academic_publication"

        ],

        academic_achievement:

            "Published undergraduate research paper"

    },


    leadership: {

        experience: [

            "student organization leader"

        ],

        responsibility:

            "Managed university research team",

        impact:

            "Created learning program"

    },


    career: {

        goal:

            "research_phd"

    }

};



const scholarships = [

    {
        metadata:{
            name:"MEXT Scholarship"
        }
    },

    {
        metadata:{
            name:"LPDP Scholarship"
        }
    }

];



console.log(

    JSON.stringify(

        generateRoadmap(

            profile,

            scholarships

        ),

        null,

        2

    )

);