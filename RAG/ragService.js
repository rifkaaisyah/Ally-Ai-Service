const {
    generateEmbedding,
    generateAIResponse
} = require("../services/aiService");

const {
    hybridRank
} = require("./hybridMatcher");
const {
    generateScholarshipQuery
} = require("./queryGenerator");

const {
    searchSimilarScholarships
} = require("./vectorStore");

const {
    buildScholarshipPrompt
} = require("./promptBuilder");

const {
    loadScholarships
} = require("./documentLoader");

const {
    filterScholarships
} = require("./filterService");

const {
    adaptAssessmentProfile
} = require("./profileAdapter");

const {
    generateRoadmap
} = require("../services/roadmapService");

async function getScholarshipRecommendation(
    studentProfile
) {
     studentProfile =
        adaptAssessmentProfile(
            studentProfile
        );

    // 1. Build a natural language query from the student's profile

    const userQuery =
        generateScholarshipQuery(
            studentProfile
        );


    // 2. Load all scholarships

    const allScholarships =
        await loadScholarships();


    // 3. Filter scholarships using profile information

    const filteredScholarships =
        filterScholarships(
            studentProfile,
            allScholarships
        );


    // 4. Get the IDs of filtered scholarships

    const allowedIds =
        filteredScholarships.map(
            scholarship => scholarship.id
        );


    // 5. Generate embedding for the student's query

    const queryVector =
        await generateEmbedding(
            userQuery
        );


    // 6. Search only within filtered scholarships

    const scholarships =
    await searchSimilarScholarships(
        queryVector,
        10,
        allowedIds
    );
const rankedScholarships =
    hybridRank(
        studentProfile,
        scholarships
    );
    console.log(
    JSON.stringify(
        rankedScholarships,
        null,
        2
    )
);


const topScholarships =
    rankedScholarships.slice(0,3);
    // 7. Build the prompt
    const roadmap =
    generateRoadmap(
        studentProfile,
        topScholarships
    );
 const prompt =
    buildScholarshipPrompt(
        userQuery,
        topScholarships,
        roadmap
    );


    // 8. Generate the AI response

    const answer =
        await generateAIResponse(
            prompt
        );


    return {

    recommendedScholarships:
        topScholarships,

    roadmap:

        roadmap,

    aiRecommendation:

        answer

};

}



module.exports = {
    getScholarshipRecommendation
};