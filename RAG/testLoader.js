console.log("TEST FILE STARTED");

const { loadScholarships } = require("./documentLoader");

async function test() {
    try {
        const scholarships = await loadScholarships();

        console.log("Number of scholarships:", scholarships.length);

        console.log("First scholarship name:");
        console.log(scholarships[0].name);

    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

test();