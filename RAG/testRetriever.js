const {
    generateEmbedding
} = require("../services/aiService");


const {
    searchSimilarScholarships
} = require("./vectorStore");



async function test() {

    try {

        const userQuery =
            `
            I am an Indonesian student.
            I want a fully funded Master's scholarship.
            I have leadership experience and want to study engineering.
            `;


        console.log(
            "User Query:"
        );

        console.log(
            userQuery
        );


        console.log(
            "\nGenerating query embedding..."
        );


        const queryVector =
            await generateEmbedding(
                userQuery
            );


        console.log(
            "Embedding generated:",
            queryVector.length
        );


        console.log(
            "\nSearching scholarships..."
        );


        const results =
            await searchSimilarScholarships(
                queryVector,
                3
            );


        console.log(
            "\nTop Matches:"
        );


        results.forEach((result, index) => {

            console.log(
                `\n#${index + 1}`
            );


            console.log(
                "Scholarship:",
                result.metadata.name
            );


            console.log(
                "Country:",
                result.metadata.country
            );


            console.log(
                "Similarity Score:",
                result.score
            );

        });


    } catch(error) {

        console.error(
            "Retriever test failed:",
            error.message
        );

    }

}


test();