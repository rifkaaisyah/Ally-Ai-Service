const {
    generateAIResponse
} = require("./aiService");


async function validateDocument({
    task,
    extractedText
}) {

    if (!task) {

        throw new Error(
            "Task is required"
        );

    }


    if (
        !extractedText ||
        !extractedText.trim()
    ) {

        return {

            valid: false,

            document_type:
                "unknown",

            confidence: 0,

            message:
                "No readable text was found in the uploaded document."

        };

    }


    const expectedDocument =
        task.expected_document_type ||
        task.title;


    const prompt = `

You are Ally, a scholarship application assistant.

Determine whether the uploaded document is the type required by the task.

Task:
${task.title}

Task description:
${task.description}

Expected document:
${expectedDocument}

Extracted document text:
${extractedText}

Determine:

1. What type of document is this?
2. Does it match the expected document?
3. Give a confidence score.

Return ONLY valid JSON.

Use exactly:

{
    "valid": true,
    "document_type": "CV",
    "confidence": 95,
    "message": "The uploaded document appears to be a CV."
}

Rules:

- valid must be true or false.
- confidence must be between 0 and 100.
- document_type must be a short document type.
- message must clearly explain the result.
- If the document is clearly unrelated, valid must be false.
- Do not use markdown.
- JSON only.

`;


    const rawResponse =
        await generateAIResponse(
            prompt
        );


    return parseDocumentValidation(
        rawResponse
    );

}


function parseDocumentValidation(
    rawResponse
) {

    if (!rawResponse) {

        throw new Error(
            "AI returned empty document validation"
        );

    }


    let cleaned =
        String(rawResponse)
            .trim();


    const firstBrace =
        cleaned.indexOf("{");


    const lastBrace =
        cleaned.lastIndexOf("}");


    if (
        firstBrace !== -1 &&
        lastBrace !== -1
    ) {

        cleaned =
            cleaned.substring(
                firstBrace,
                lastBrace + 1
            );

    }


    let result;


    try {

        result =
            JSON.parse(cleaned);

    }

    catch (error) {

        throw new Error(
            "AI returned invalid document validation"
        );

    }


    return {

        valid:
            result.valid === true,

        document_type:
            String(
                result.document_type ||
                "unknown"
            ),

        confidence:
            Number(
                result.confidence || 0
            ),

        message:
            String(
                result.message ||
                ""
            )

    };

}


module.exports = {
    validateDocument
};