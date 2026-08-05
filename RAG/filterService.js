function filterScholarships(profile, scholarships) {

    return scholarships.filter((scholarship) => {

        let score = 0;

        // Field of study
        if (
            scholarship.fields_of_study.includes("All fields") ||
scholarship.fields_of_study.some(field =>
    field.includes(profile.study_field) ||
    field.includes("All fields")
)        ) {
            score += 2;
        }
        if (
    profile.nationality === "Indonesian" &&
    scholarship.requirements.nationality.includes("Indonesian")
) {
    score += 3;
}

        // Leadership
        if (
            profile.leadership === "Strong leadership experience" &&
            scholarship.requirements.leadership_required
        ) {
            score += 1;
        }

        // Community / impact
        if (
            profile.impact === "Created social impact" &&
            scholarship.requirements.community_service_required
        ) {
            score += 1;
        }

        // English
        if (
            profile.english === "English proficiency ready"
        ) {
            score += 1;
        }

        scholarship.filterScore = score;

        return score > 0;
    })
    .sort((a, b) => b.filterScore - a.filterScore);

}

module.exports = {
    filterScholarships
};