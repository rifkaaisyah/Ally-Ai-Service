const {
    loadScholarships
} = require("./documentLoader");


const {
    createScholarshipChunks
} = require("./chunker");



async function test() {

    try {

        const scholarships =
            await loadScholarships();


        const chunks =
            createScholarshipChunks(
                scholarships
            );


        console.log(
            "Number of chunks:",
            chunks.length
        );


        console.log(
            "\nFirst chunk:"
        );


        console.log(
            chunks[0]
        );


    } catch(error) {

        console.error(
            "Chunking test failed:",
            error.message
        );

    }

}


test();