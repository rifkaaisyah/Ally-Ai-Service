const {
    getScholarshipRecommendation
} = require("./ragService");

const {
    adaptAssessmentProfile
} = require("./profileAdapter");

async function test() {

    const deepProfile = {

        student_profile: {

            academic: {

                study_direction:
                    "Artificial Intelligence",

                academic_experiences: [
                    "research_experience",
                    "academic_publication"
                ],

                academic_achievement:
                    "Published AI healthcare research paper"

            },

            leadership: {

                experience: [
                    "community_leadership"
                ],

                impact:
                    "measurable_result"

            },

            career: {

                goal:
                    "research_phd",

                contribution_area:
                    "AI healthcare innovation"

            },

            scholarship_preferences: {

                target_countries: [
                    "Japan",
                    "Germany"
                ],

                scholarship_type:
                    "fully_funded"

            }

        }

    };

    const adaptedProfile =
        adaptAssessmentProfile(
            deepProfile
        );

    const result =
        await getScholarshipRecommendation(
            adaptedProfile
        );

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

test();