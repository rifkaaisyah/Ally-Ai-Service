const {
    generateAIResponse
} = require("./aiService");

/**
 * Evaluate a student's response to a journey task.
 *
 * The evaluator is intentionally designed to:
 * 1. Return strict JSON.
 * 2. Be reasonably consistent between similar answers.
 * 3. Avoid rejecting a good answer just because the score is slightly below 70.
 * 4. Prevent malformed AI JSON from breaking the journey.
 */
async function evaluateTask({
    task,
    studentAnswer,
    scholarship
}) {

    if (!task) {
        throw new Error("Task is required");
    }

    if (
        !studentAnswer ||
        !studentAnswer.trim()
    ) {
        throw new Error("Student answer is required");
    }

    const prompt = `
You are Ally, an AI scholarship preparation assistant.

Evaluate a student's response to a scholarship preparation task.

Scholarship:
${scholarship?.name || "Unknown scholarship"}

Task:
${task.title}

Task description:
${task.description}

Student response:
${studentAnswer}

Evaluate the response using these criteria:

1. Relevance to the task
2. Specificity
3. Evidence
4. Clarity
5. Scholarship readiness

IMPORTANT COMPLETION RULE:

A response should be marked "completed" when it adequately answers the task and contains enough relevant information for scholarship preparation.

Do NOT require a perfect answer.

Do NOT reject a response merely because it could be improved.

If the response is relevant, understandable, and provides reasonable evidence or explanation, it should normally be completed.

Use "needs_improvement" only when the response is clearly insufficient, off-topic, extremely vague, or does not actually answer the task.

Scoring guidance:

90-100 = excellent
80-89 = strong
70-79 = acceptable/good
60-69 = partially acceptable but needs meaningful improvement
0-59 = insufficient

IMPORTANT:

A score between 60 and 69 may still be marked completed if the response adequately answers the task.

The canComplete decision must be based on whether the student has provided enough information to move forward, NOT simply on whether the score is above 70.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "score": 0,
  "status": "completed",
  "feedback": "",
  "suggestions": [],
  "canComplete": true
}

Rules:

- score must be a number from 0 to 100.
- status must be exactly "completed" or "needs_improvement".
- canComplete must be exactly true or false.
- feedback must be a string.
- suggestions must be an array of strings.
- If the answer is adequate, use status "completed" and canComplete true.
- If the answer is clearly insufficient, use status "needs_improvement" and canComplete false.
- Every JSON string must use double quotes.
- Escape double quotes inside strings.
- Do not use markdown.
- Do not use code fences.
- Do not include explanations outside the JSON.
- Do not include trailing commas.
- Do not put raw line breaks inside strings.
- Return JSON only.
`;

    const rawResponse =
        await generateAIResponse(prompt);

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

    /**
     * Remove markdown code fences.
     */
    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    /**
     * If the AI accidentally included text before
     * or after the JSON, extract the outer JSON object.
     */
    const firstBrace =
        cleaned.indexOf("{");

    const lastBrace =
        cleaned.lastIndexOf("}");

    if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
    ) {
        cleaned =
            cleaned.substring(
                firstBrace,
                lastBrace + 1
            );
    }

    let evaluation;

    /**
     * First attempt: parse exactly what we have.
     */
    try {

        evaluation =
            JSON.parse(cleaned);

    }
    catch (firstError) {

        console.log(
            "Initial JSON parsing failed. Attempting repair..."
        );

        const repaired =
            repairAIJson(cleaned);

        if (!repaired) {

            console.error(
                "Task Evaluation JSON Error:",
                firstError
            );

            console.error(
                "Raw AI Response:",
                rawResponse
            );

            throw new Error(
                "AI returned an invalid task evaluation"
            );
        }

        try {

            evaluation =
                JSON.parse(repaired);

        }
        catch (secondError) {

            console.error(
                "Task Evaluation JSON Repair Failed:",
                secondError
            );

            console.error(
                "Original AI Response:",
                rawResponse
            );

            console.error(
                "Repaired Response:",
                repaired
            );

            throw new Error(
                "AI returned an invalid task evaluation"
            );
        }
    }

    /**
     * Validate score.
     */
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

    /**
     * Normalize feedback.
     */
    const feedback =
        typeof evaluation.feedback === "string"
            ? evaluation.feedback.trim()
            : "";

    /**
     * Normalize suggestions.
     */
    let suggestions = [];

    if (
        Array.isArray(
            evaluation.suggestions
        )
    ) {

        suggestions =
            evaluation.suggestions
                .filter(
                    item =>
                        typeof item === "string"
                )
                .map(
                    item =>
                        item.trim()
                )
                .filter(
                    item =>
                        item.length > 0
                );
    }

    /**
     * Normalize completion state.
     *
     * We trust canComplete when it is a real boolean.
     *
     * However, if the AI returns a score >= 70
     * and says completed, ensure the two values agree.
     */
    let canComplete =
        evaluation.canComplete === true;

    let status =
        evaluation.status ===
        "completed"
            ? "completed"
            : "needs_improvement";

    /**
     * Make completed + canComplete consistent.
     */
    if (status === "completed") {
        canComplete = true;
    }

    if (canComplete === true) {
        status = "completed";
    }

    return {
        score,
        status,
        feedback,
        suggestions,
        canComplete
    };
}


/**
 * Attempt to repair common malformed JSON
 * returned by an AI model.
 */
function repairAIJson(text) {

    if (!text) {
        return null;
    }

    let repaired =
        text.trim();

    /**
     * Remove markdown fences again just in case.
     */
    repaired = repaired
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    /**
     * Remove accidental control characters.
     */
    repaired =
        repaired.replace(
            /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
            " "
        );

    /**
     * Fix missing commas between JSON array strings.
     *
     * Example:
     *
     * [
     *   "one"
     *   "two"
     * ]
     *
     * becomes:
     *
     * [
     *   "one",
     *   "two"
     * ]
     */
    repaired =
        repaired.replace(
            /"\s*\n\s*"/g,
            '",\n"'
        );

    /**
     * Fix a common missing comma before the next property.
     *
     * Example:
     *
     * "suggestion"
     * }
     *
     * becomes:
     *
     * "suggestion"
     * ],
     * }
     *
     * only when appropriate.
     */

    repaired =
        repairSuggestionsArray(
            repaired
        );

    /**
     * Remove trailing commas.
     *
     * JSON does not allow:
     *
     * {
     *   "score": 80,
     * }
     */
    repaired =
        repaired.replace(
            /,\s*([}\]])/g,
            "$1"
        );

    /**
     * Try parsing.
     */
    try {

        JSON.parse(repaired);

        return repaired;

    }
    catch (error) {

        return null;
    }
}


/**
 * Repair a missing closing suggestions array.
 */
function repairSuggestionsArray(text) {

    const suggestionsIndex =
        text.indexOf(
            '"suggestions"'
        );

    const canCompleteIndex =
        text.indexOf(
            '"canComplete"'
        );

    if (
        suggestionsIndex === -1 ||
        canCompleteIndex === -1 ||
        canCompleteIndex <= suggestionsIndex
    ) {
        return text;
    }

    const section =
        text.substring(
            suggestionsIndex,
            canCompleteIndex
        );

    /**
     * If the suggestions array already contains
     * a closing bracket, leave it alone.
     */
    if (
        section.includes("]")
    ) {
        return text;
    }

    /**
     * Find the last quote in the suggestions section.
     */
    const lastQuote =
        section.lastIndexOf('"');

    if (lastQuote === -1) {
        return text;
    }

    const absolutePosition =
        suggestionsIndex +
        lastQuote +
        1;

    return (
        text.substring(
            0,
            absolutePosition
        ) +
        ",\n  ],\n  " +
        text.substring(
            canCompleteIndex
        )
    );
}


module.exports = {
    evaluateTask
};