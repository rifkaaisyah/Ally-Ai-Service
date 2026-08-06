function generateReason(result) {

    const strengths = result.strengths;
    const improvements = result.improvements;

    let summary = "";

    if (strengths.length > 0) {
        summary +=
            "You demonstrate " +
            strengths.join(", ").toLowerCase() +
            ". ";
    }

    if (improvements.length > 0) {
        summary +=
            "To further strengthen your scholarship readiness, focus on " +
            improvements.join(", ").toLowerCase() +
            ".";
    }

    return summary;
}

module.exports = {
    generateReason
};