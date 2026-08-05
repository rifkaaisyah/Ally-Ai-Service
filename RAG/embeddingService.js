const fs = require("fs/promises");
const path = require("path");

const {
    generateEmbedding
} = require("../services/aiService");


async function createScholarshipEmbeddings(chunks) {

    const embeddedChunks = [];


    for (const chunk of chunks) {

        console.log(
            `Generating embedding for: ${chunk.metadata.name}`
        );


        const vector = await generateEmbedding(
            chunk.text
        );


        embeddedChunks.push({

    id: chunk.id,

    text: chunk.text,

    vector: vector,

    metadata: chunk.metadata,

    requirements: chunk.requirements,

    fields_of_study: chunk.fields_of_study,

    profile_tags: chunk.profile_tags

});
    }


    const outputPath = path.join(
        __dirname,
        "embeddings",
        "scholarshipEmbeddings.json"
    );


    await fs.writeFile(
        outputPath,
        JSON.stringify(
            embeddedChunks,
            null,
            2
        )
    );


    console.log(
        "Embeddings saved:",
        outputPath
    );


    return embeddedChunks;
}


module.exports = {
    createScholarshipEmbeddings
};