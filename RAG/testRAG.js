const {
    getScholarshipRecommendation
} = require("./ragService");



async function test(){

    const query = `
I am an Indonesian student.

I want to study Master's degree in engineering.

I have leadership experience.

I need a fully funded scholarship.
`;


    try {

        const answer =
            await getScholarshipRecommendation(
                query
            );


        console.log(
            "\nALLY RESPONSE:\n"
        );


        console.log(
            answer
        );


    } catch(error){

        console.error(
            "RAG failed:",
            error.message
        );

    }

}


test();