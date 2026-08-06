function normalizeAnswers(answers) {

    const normalized = {};


    const mappings = {


        "Below 2.50": "below_2.50",

        "I do not know yet": "no_idea",

        "Not yet": "not_yet",

        "Not yet developed": "not_yet",

        "I have never prepared my story": "not_confident",

        "No CV yet": "none",

        "No essay yet": "none",

        "I do not know where to start": "no_idea",


        "Yes, but I was rejected": "previous_rejection"

    };


    for (const key in answers) {

        const value = answers[key];


        normalized[key] =
            mappings[value] || value;

    }


    return normalized;

}


module.exports = {
    normalizeAnswers
};