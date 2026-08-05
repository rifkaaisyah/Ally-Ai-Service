const fs = require("fs/promises");
const path = require("path");


async function loadEmbeddings() {

    const filePath = path.join(
        __dirname,
        "embeddings",
        "scholarshipEmbeddings.json"
    );


    const data =
        await fs.readFile(
            filePath,
            "utf8"
        );


    return JSON.parse(data);
}



function cosineSimilarity(vectorA, vectorB) {

    let dotProduct = 0;

    let magnitudeA = 0;

    let magnitudeB = 0;


    for (let i = 0; i < vectorA.length; i++) {

        dotProduct +=
            vectorA[i] * vectorB[i];


        magnitudeA +=
            vectorA[i] ** 2;


        magnitudeB +=
            vectorB[i] ** 2;

    }


    return (
        dotProduct /
        (
            Math.sqrt(magnitudeA) *
            Math.sqrt(magnitudeB)
        )
    );

}



async function searchSimilarScholarships(
    queryVector,
    topK = 3,
    allowedIds = null
) {

    const embeddings =
        await loadEmbeddings();


    let searchableEmbeddings = embeddings;


    if (allowedIds) {

        searchableEmbeddings =
            embeddings.filter(item =>
                allowedIds.includes(item.id)
            );

    }


    const results =
        searchableEmbeddings.map(item => {

            return {

                id: item.id,

                score:
                    cosineSimilarity(
                        queryVector,
                        item.vector
                    ),

                text: item.text,

                metadata: item.metadata,

                requirements: item.requirements,

                fields_of_study: item.fields_of_study,

                profile_tags: item.profile_tags

            };

        });


    return results
        .sort(
            (a, b) =>
                b.score - a.score
        )
        .slice(0, topK);

}




module.exports = {

    loadEmbeddings,

    cosineSimilarity,

    searchSimilarScholarships

};