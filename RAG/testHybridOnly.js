const {
    searchSimilarScholarships
} = require("./vectorStore");

const {
    generateEmbedding
} = require("../services/aiService");

const {
    hybridRank
} = require("./hybridMatcher");


async function test(){

const profile = {

    nationality:"Indonesian",

    study_field:"Engineering",

    leadership:true,

    impact:true,

    academic_profile:{
        academic_strength:"Excellent"
    },

    english:"English proficiency ready"

};


const query =
"Indonesian engineering student looking for fully funded master scholarship";


const vector =
await generateEmbedding(query);



const results =
await searchSimilarScholarships(
    vector,
    10
);



const ranked =
hybridRank(
    profile,
    results
);


console.log(
JSON.stringify(
ranked.slice(0,5),
null,
2
)
);


}


test();