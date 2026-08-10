const {
    generateAIResponse
} = require("./aiService");

/**
 * Evaluate a student's response to a journey task.
 *
 * This uses the existing AI service.
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

Return ONLY valid JSON.

The response MUST use exactly this structure:

{
  "score": 0,
  "status": "completed",
  "feedback": "",
  "suggestions": [],
  "canComplete": true
}

Rules:

- score must be a number between 0 and 100.
- status must be exactly "completed" or "needs_improvement".
- canComplete must be exactly true or false.
- feedback must be a string.
- suggestions must be an array of strings.
- Every string must have matching double quotes.
- Every JSON object must be properly closed.
- Every JSON array must be properly closed.
- Every property must be separated by a comma.
- Use standard JSON syntax.
- Escape double quotes inside strings.
- Do not put raw line breaks inside JSON strings.
- Do not include markdown.
- Do not include code fences.
- Do not include explanations before or after the JSON.
- Return JSON only.
- Before returning the response, verify that it is valid JSON that can be parsed with JSON.parse().
`;

    const rawResponse = await generateAIResponse(prompt);

    return parseEvaluationResponse(rawResponse);
}


/**
 * Safely convert the AI response into JSON.
 */
function parseEvaluationResponse(rawResponse) {

    if (!rawResponse) {
        throw new Error(
            "AI returned an empty evaluation"
        );
    }

    let cleaned = String(rawResponse).trim();

    /**
     * Remove accidental markdown fences.
     */
    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


    /**
     * First attempt:
     *
     * Try parsing exactly what the AI returned.
     */
    let evaluation;

    try {

        evaluation = JSON.parse(cleaned);

    }
    catch (firstError) {

        console.log(
            "Initial JSON parsing failed. Attempting repair..."
        );

        /**
         * Try repairing common AI JSON mistakes.
         */
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
     * Normalize completion state.
     */
    const canComplete =
        evaluation.canComplete === true;


    const status =
        canComplete
            ? "completed"
            : "needs_improvement";


    /**
     * Normalize suggestions.
     *
     * Make sure the FE always receives
     * an array of strings.
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


    return {

        score,

        status,

        feedback:
            typeof evaluation.feedback === "string"
                ? evaluation.feedback.trim()
                : "",

        suggestions,

        canComplete

    };
}


/**
 * Attempt to repair common malformed
 * JSON returned by an AI model.
 *
 * This is intentionally conservative.
 */
function repairAIJson(text) {

    if (!text) {
        return null;
    }

    let repaired = text.trim();


    /**
     * --------------------------------------------------
     * CASE 1
     * --------------------------------------------------
     *
     * Missing closing ] for suggestions.
     *
     * Example:
     *
     * "suggestions": [
     *   "Improve leadership evidence."
     * "canComplete": true
     *
     * We insert:
     *
     * ],
     *
     */
    repaired =
        repairMissingSuggestionsArray(
            repaired
        );


    /**
     * --------------------------------------------------
     * CASE 2
     * --------------------------------------------------
     *
     * Missing comma between suggestion strings.
     *
     * Example:
     *
     * "suggestions": [
     *   "Suggestion one"
     *   "Suggestion two"
     * ]
     *
     * Become:
     *
     * "suggestions": [
     *   "Suggestion one",
     *   "Suggestion two"
     * ]
     */
    repaired =
        repairMissingSuggestionComma(
            repaired
        );


    /**
     * --------------------------------------------------
     * CASE 3
     * --------------------------------------------------
     *
     * Remove accidental control characters
     * inside JSON strings.
     */
    repaired =
        repaired.replace(
            /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
            " "
        );


    /**
     * Try parsing the repaired result.
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
 * Repair a missing closing ] in suggestions.
 */
function repairMissingSuggestionsArray(text) {

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


    const suggestionsSection =
        text.substring(
            suggestionsIndex,
            canCompleteIndex
        );


    /**
     * If the array is already closed,
     * nothing needs to be done.
     */
    if (
        suggestionsSection.includes("]")
    ) {

        return text;
    }


    /**
     * Find the last quote before canComplete.
     */
    const lastQuote =
        suggestionsSection.lastIndexOf(
            '"'
        );


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


/**
 * Repair missing commas between
 * suggestion strings.
 */
function repairMissingSuggestionComma(text) {

    const suggestionsIndex =
        text.indexOf(
            '"suggestions"'
        );

    if (
        suggestionsIndex === -1
    ) {

        return text;
    }


    const arrayStart =
        text.indexOf(
            "[",
            suggestionsIndex
        );

    const arrayEnd =
        text.indexOf(
            "]",
            arrayStart
        );


    if (
        arrayStart === -1 ||
        arrayEnd === -1
    ) {

        return text;
    }


    const before =
        text.substring(
            0,
            arrayStart + 1
        );

    const array =
        text.substring(
            arrayStart + 1,
            arrayEnd
        );

    const after =
        text.substring(
            arrayEnd
        );


    /**
     * Add commas where two JSON strings
     * are accidentally placed next to each other.
     */
    const repairedArray =
        array.replace(
            /"\s*\n\s*"/g,
            '",\n"'
        );


    return (
        before +
        repairedArray +
        after
    );
}


module.exports = {
    evaluateTask
};