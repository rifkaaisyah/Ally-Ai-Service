const fs = require("fs");
const path = require("path");

async function testDeepAssessmentAPI() {

    try {

        const payloadPath =
            path.join(
                __dirname,
                "testDeepAssessmentPayload.json"
            );


        const payload =
            JSON.parse(
                fs.readFileSync(
                    payloadPath,
                    "utf8"
                )
            );


        const response =
            await fetch(
    "http://localhost:3001/api/assessment/deep",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:
                    JSON.stringify(payload)
                }
            );


        const result =
            await response.json();


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


    }
    catch(error){

        console.error(
            "Test failed:",
            error.message
        );

    }

}


testDeepAssessmentAPI();