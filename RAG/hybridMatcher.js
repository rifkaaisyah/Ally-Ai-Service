function calculateEligibilityScore(
    profile,
    scholarship
) {

    let score = 0;

    let reasons = [];

    let missing = [];


    // 1. Nationality match

// Nationality match

const nationalityRequirement =
    scholarship.requirements?.nationality?.toLowerCase();


const studentNationality =
    profile.nationality?.toLowerCase();


if (nationalityRequirement) {


    if (
        nationalityRequirement.includes("international")
    ) {

        score += 15;

        reasons.push(
            "International students eligible"
        );

    }


    else if (
        nationalityRequirement.includes(
            studentNationality
        )
    ) {

        score += 15;

        reasons.push(
            "Nationality matches"
        );

    }


    else if (
        nationalityRequirement.includes(
            "developing countries"
        )
    ) {

        score += 10;

        reasons.push(
            "Nationality likely eligible (developing country)"
        );

    }


    else if (
        nationalityRequirement.includes(
            "depends"
        )
    ) {

        score += 5;

        reasons.push(
            "Nationality requires country-specific verification"
        );

    }


    else {

        missing.push(
            "Check nationality eligibility"
        );

    }

}

    // 2. Study field match

    if (
        scholarship.fields_of_study &&
        scholarship.fields_of_study.some(field =>
            field.toLowerCase()
                .includes(
                    profile.study_field.toLowerCase()
                )
        )
    ) {

        score += 15;

        reasons.push(
            "Study field matches"
        );

    }

// Study level match

if (
    scholarship.metadata?.study_levels &&
    profile.target_degree &&
    scholarship.metadata.study_levels.includes(
        profile.target_degree
    )
) {

    score += 10;

    reasons.push(
        "Study level matches"
    );

}

    // 3. Leadership match

    if (
        profile.leadership &&
        scholarship.profile_tags &&
        scholarship.profile_tags.includes(
            "leadership"
        )
    ) {

        score += 10;

        reasons.push(
            "Leadership experience matches"
        );

    }



    // 4. Social impact match

    if (
        profile.impact &&
        scholarship.profile_tags &&
        scholarship.profile_tags.includes(
            "social impact"
        )
    ) {

        score += 10;

        reasons.push(
            "Social impact matches"
        );

    }



    // 5. GPA strength

    if (
        profile.academic_profile &&
        profile.academic_profile.academic_strength === "Excellent"
    ) {

        score += 10;

        reasons.push(
            "Strong academic background"
        );

    }



    // 6. English readiness

    if (
        profile.english === "English proficiency ready"
    ) {

        score += 5;

        reasons.push(
            "English requirement preparation ready"
        );

    }
    // 7. Work experience requirement

if (
    scholarship.requirements &&
    scholarship.requirements.minimum_work_experience_years
) {

    const requiredYears =
        scholarship.requirements.minimum_work_experience_years;


    const studentYears =
        profile.work_experience_years || 0;


    if (studentYears >= requiredYears) {

        score += 10;

        reasons.push(
            "Work experience requirement matches"
        );

    } else {

        score -= 10;

        missing.push(
            `${requiredYears} years work experience required`
        );

    }

}


    return {

        score,

        reasons,

        missing

    };

}





function hybridRank(
    profile,
    scholarships
) {


    return scholarships
        .map(
            scholarship => {


                const eligibility =
                    calculateEligibilityScore(
                        profile,
                        scholarship
                    );



                const semanticScore =
                    scholarship.score * 50;



                const finalScore =
                    semanticScore +
                    eligibility.score;



                return {

                    ...scholarship,

                    finalScore,

                    eligibility

                };


            }
        )


        .sort(
            (a,b) =>
                b.finalScore -
                a.finalScore
        );

}





module.exports = {

    hybridRank,

    calculateEligibilityScore

};