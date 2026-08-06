function buildScholarshipPrompt(
    userQuery,
    scholarships,
    roadmap
) {


const scholarshipContext =
    scholarships
        .map(
            (scholarship, index) => {


return `
Scholarship ${index + 1}

Name:
${scholarship.metadata.name}

Country:
${scholarship.metadata.country}

Match Score:
${Math.round(scholarship.finalScore)}

Eligibility Reasons:
${
    scholarship.eligibility.reasons.length
    ? scholarship.eligibility.reasons.join(", ")
    : "No strong matches found"
}


Missing Requirements:
${
    scholarship.eligibility.missing.length
    ? scholarship.eligibility.missing.join(", ")
    : "None"
}


Requirements:

Nationality:
${scholarship.requirements.nationality}

Leadership Required:
${scholarship.requirements.leadership_required}

Community Service Required:
${scholarship.requirements.community_service_required}


Description:
${scholarship.text}

-------------------------
`;

}
)
.join("\n");



return `

You are Ally, an AI scholarship coach.

Analyze the student profile and scholarship matches.

IMPORTANT RULES:

1. Only use the eligibility reasons and missing requirements provided.
2. Do not invent student information.
3. Do not claim a student is ineligible if the eligibility section says they match.
4. Explain weaknesses using the missing requirements only.

VERY IMPORTANT:

Do not infer eligibility from country names.

Only use explicit nationality requirements.

If nationality says "International students",
consider the student potentially eligible.

Never say someone is ineligible unless the context explicitly states it.


Student Query:

${userQuery}


Scholarship Matching Results:

${scholarshipContext}



Recommended Preparation Roadmap:

${
roadmap
?
JSON.stringify(
    roadmap,
    null,
    2
)
:
"No roadmap available"
}



Generate:

1. Top scholarship recommendations.
2. Why each scholarship matches.
3. Remaining weaknesses.
4. Action plan.

`;

}



module.exports = {
    buildScholarshipPrompt
};