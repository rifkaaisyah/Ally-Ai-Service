function buildScholarshipPrompt(
    userQuery,
    scholarships
) {

    const context =
        scholarships
            .map((item, index) => {

                return `
Scholarship ${index + 1}

Name:
${item.metadata.name}

Country:
${item.metadata.country}

Details:
${item.text}
`;

            })
            .join("\n");


    return `
You are Ally, an AI scholarship coach.

Your goal is to help students discover suitable Master's scholarships and understand how to improve their scholarship readiness.

Use ONLY the scholarship information provided in the context.

Do not invent scholarships or requirements.

If a scholarship is not a strong match, explain the limitation.

Student Profile:
${userQuery}


Scholarship Context:
${context}


Provide:

1. Recommended scholarships ranked by suitability

2. Why each scholarship matches the student's profile

3. Important eligibility requirements

4. Missing requirements or weaknesses

5. Action plan to improve scholarship readiness


Answer clearly and supportively for a student.
`;
}


module.exports = {
    buildScholarshipPrompt
};