const {
    loadScholarships
} = require("./documentLoader");


const {
    createScholarshipChunks
} = require("./chunker");


const {
    createScholarshipEmbeddings
} = require("./embeddingService");



async function test(){

    try {

        const scholarships =
            await loadScholarships();


        const chunks =
            createScholarshipChunks(scholarships);


        const embeddings =
            await createScholarshipEmbeddings(
                chunks
            );


        console.log(
            "Total embeddings:",
            embeddings.length
        );


    } catch(error){

        console.error(
            "Embedding creation failed:",
            error.message
        );

    }

}


test();