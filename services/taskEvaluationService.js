const {
    generateAIResponse
} = require("./aiService");


/**
 * Evaluate a student's response to a journey task.
 *
 * This uses the existing AI service, so we don't need
 * another AI provider or another API setup.
 */
async function evaluateTask({
    task,
    studentAnswer,
    scholarship
}) {

    if (!task) {
        throw new Error("Task is required");
    }

    if (!studentAnswer || !studentAnswer.trim()) {
        throw new Error("Student answer is required");
    }


    const prompt = `
You are Ally, an AI scholarship preparation assistant.

Evaluate the student's response to a scholarship preparation task.

Scholarship:
${scholarship?.name || "Unknown scholarship"}

Task:
${task.title}

Task description:
${task.description}

Student response:
${studentAnswer}

Evaluate the response based on:

1. Relevance to the task
2. Specificity
3. Evidence
4. Clarity
5. Scholarship readiness

Return ONLY valid JSON using this exact structure:

{
    "score": 0,
    "status": "completed",
    "feedback": "",
    "suggestions": [],
    "canComplete": true
}

Rules:

- score must be between 0 and 100.
- status must be either:
  "completed"
  or
  "needs_improvement"

- canComplete should be true when the response is strong enough
  to satisfy the task.

- canComplete should be false when the student needs
  meaningful improvement.

- feedback should briefly explain the evaluation.

- suggestions should contain practical improvements.

Do not include markdown.
Do not include code fences.
Return JSON only.
`;


    const rawResponse =
        await generateAIResponse(
            prompt
        );


    return parseEvaluationResponse(
        rawResponse
    );
}


/**
 * Safely convert the AI response into JSON.
 */
function parseEvaluationResponse(
    rawResponse
) {

    if (!rawResponse) {

        throw new Error(
            "AI returned an empty evaluation"
        );

    }


    let cleaned =
        String(rawResponse).trim();


    // Remove accidental markdown fences.
    cleaned =
        cleaned
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();


    let evaluation;

    try {

        evaluation =
            JSON.parse(cleaned);

    } catch (error) {

        console.error(
            "Task Evaluation JSON Error:",
            error
        );

        console.error(
            "Raw AI Response:",
            rawResponse
        );

        throw new Error(
            "AI returned an invalid task evaluation"
        );

    }


    const score =
        Number(evaluation.score);


    if (
        Number.isNaN(score) ||
        score < 0 ||
        score > 100
    ) {

        throw new Error(
            "AI returned an invalid evaluation score"
        );

    }


    const canComplete =
        Boolean(
            evaluation.canComplete
        );


    const status =
        canComplete
            ? "completed"
            : "needs_improvement";


    return {

        score,

        status,

        feedback:
            evaluation.feedback ||
            "",

        suggestions:
            Array.isArray(
                evaluation.suggestions
            )
                ? evaluation.suggestions
                : [],

        canComplete

    };
}


module.exports = {
    evaluateTask
};