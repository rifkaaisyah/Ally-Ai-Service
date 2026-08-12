const {
    analyzeDeepAssessment
} = require("./services/deepAssessmentService");


async function test() {

    console.log("\n=== DEEP ASSESSMENT + SCHOLARSHIP RECOMMENDATION TEST ===\n");


    const answers = {

        q1_why_do_you_want_to_pursue_this_masters_degree:
            "Career advancement",

        q2_master_motivation:
            "I already know the exact program and universities I want",

        q3_master_plan_clarity:
            "Academic competition",

        q4_academic_experience:
            "Belum ada pencapaian akademik yang bisa saya jelaskan saat ini.",

        q5_academic_achievement_description:
            "Yes, one major project",

        q6_field_project_experience:
            "Belum pernah memegang tanggung jawab besar.",

        q7_leadership_experience:
            "",

        q8_leadership_responsibility:
            "No measurable impact yet",

        q9_leadership_impact:
            "Still exploring",

        q10_career_goal:
            "Masih belum tahu ingin berkontribusi di bidang apa.",

        q11_career_contribution_area:
            "Japan",

        q12_target_countries:
            "Any suitable opportunity",

        q13_scholarship_type:
            "",

        q14_scholarship_priority:
            "No CV yet",

        q15_cv_strength:
            "I have not started",

        q16_essay_readiness:
            "I do not know who to ask yet",

        q17_recommendation_availability:
            "Very limited time",

        q18_preparation_time:
            "More than 1 year",

        q19_application_deadline_target:
            ""

    };


    try {

        const result =
            await analyzeDeepAssessment(
                answers,
                {}
            );


        console.log(
            "\n=== FULL RESULT ===\n"
        );

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


        console.log(
            "\n=== READINESS ===\n"
        );

        console.log(
            "Revised Percentage:",
            result.assessment.revised_percentage + "%"
        );


        console.log(
            "\n=== SUGGESTION ===\n"
        );

        console.log(
            result.assessment.suggestion
        );


        console.log(
            "\n=== BEASISWA RECOMMENDATION ===\n"
        );


        console.log(
            JSON.stringify(
                result.assessment.beasiswa_recomendation,
                null,
                2
            )
        );


        if (
            result.assessment.beasiswa_recomendation
        ) {

            console.log(
                "\nRecommended Scholarship:"
            );

            console.log(
                result.assessment
                    .beasiswa_recomendation
                    .metadata?.name
            );


            console.log(
                "Scholarship ID:"
            );

            console.log(
                result.assessment
                    .beasiswa_recomendation
                    .id
            );


            console.log(
                "Match Score:"
            );

            console.log(
                result.assessment
                    .beasiswa_recomendation
                    .finalScore
            );

        }
        else {

            console.log(
                "\nNo scholarship recommendation returned."
            );

        }


    }
    catch (error) {

        console.error(
            "\n=== TEST FAILED ===\n"
        );

        console.error(error);

        process.exitCode = 1;

    }

}


test();