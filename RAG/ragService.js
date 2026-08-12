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


const {
    attachDeadlineInformation
} = require("../services/scholarshipDeadlineService");



async function getScholarshipRecommendation(
    studentProfile
) {

    studentProfile =
        adaptAssessmentProfile(
            studentProfile
        );


    // ---------------------------------------------------------
    // 1. Build natural language query
    // ---------------------------------------------------------

    const userQuery =
        generateScholarshipQuery(
            studentProfile
        );


    // ---------------------------------------------------------
    // 2. Load all scholarships
    // ---------------------------------------------------------

    const allScholarships =
        await loadScholarships();


    // ---------------------------------------------------------
    // 3. Filter scholarships
    // ---------------------------------------------------------

    const filteredScholarships =
        filterScholarships(
            studentProfile,
            allScholarships
        );


    // ---------------------------------------------------------
    // 4. Get allowed scholarship IDs
    // ---------------------------------------------------------

    const allowedIds =
        filteredScholarships.map(
            scholarship =>
                scholarship.id
        );


    // ---------------------------------------------------------
    // 5. Generate embedding
    // ---------------------------------------------------------

    const queryVector =
        await generateEmbedding(
            userQuery
        );


    // ---------------------------------------------------------
    // 6. Search filtered scholarships
    // ---------------------------------------------------------

    const scholarships =
        await searchSimilarScholarships(
            queryVector,
            10,
            allowedIds
        );


    // ---------------------------------------------------------
    // 7. Rank scholarships
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // 8. Pick ONLY the highest-ranked scholarship
    //
    // hybridRank already orders the scholarships from
    // highest score to lowest score.
    // ---------------------------------------------------------

    const beasiswa_recomendation =
        rankedScholarships[0];


    // ---------------------------------------------------------
    // 9. Attach deadline information
    // ---------------------------------------------------------

    const scholarshipsWithDeadlines =
        attachDeadlineInformation(
            beasiswa_recomendation
                ? [beasiswa_recomendation]
                : []
        );


    const finalRecommendation =
        scholarshipsWithDeadlines[0] || null;


    // ---------------------------------------------------------
    // 10. Generate roadmap
    // ---------------------------------------------------------

    const roadmap =
        generateRoadmap(
            studentProfile,
            finalRecommendation
                ? [finalRecommendation]
                : []
        );


    // ---------------------------------------------------------
    // 11. Build AI prompt
    // ---------------------------------------------------------

    const prompt =
        buildScholarshipPrompt(
            userQuery,
            finalRecommendation
                ? [finalRecommendation]
                : [],
            roadmap
        );


    // ---------------------------------------------------------
    // 12. Generate AI response
    // ---------------------------------------------------------

    const answer =
        await generateAIResponse(
            prompt
        );


    // ---------------------------------------------------------
    // 13. Return ONE scholarship recommendation
    // ---------------------------------------------------------

    return {

        beasiswa_recomendation:
            finalRecommendation,

        roadmap,

        aiRecommendation:
            answer

    };

}



module.exports = {
    getScholarshipRecommendation
};