const {
    generateEmbedding
} = require("../services/aiService");


async function test() {

    try {

        const vector = await generateEmbedding(
            "LPDP Scholarship supports Indonesian future leaders"
        );


        console.log(
            "Embedding size:",
            vector.length
        );


        console.log(
            "First 5 values:",
            vector.slice(0, 5)
        );


    } catch(error) {

        console.error(error.message);

    }

}


test();