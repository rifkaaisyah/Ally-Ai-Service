const fs = require("fs");
const path = require("path");

async function testDashboard() {

    try {

        const payload = JSON.parse(

            fs.readFileSync(

                path.join(
                    __dirname,
                    "testDeepAssessmentPayload.json"
                ),

                "utf8"

            )

        );

        const response = await fetch(

            "http://localhost:3001/api/dashboard",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

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
    catch (err) {

        console.error(err);

    }

}

testDashboard();