const {
    matchMentor
} = require("./services/mentorMatchingService");

const mentors =
    require("./data/journeys/mentors.json");


const studentProfile = {

    student_profile: {

        academic: {
            master_motivation:
                "I already know the exact program and universities I want",

            study_plan_clarity:
                "Academic competition",

            academic_experiences: [
                "Belum ada pencapaian akademik yang bisa saya jelaskan saat ini."
            ],

            academic_achievement:
                "Yes, one major project",

            field_project_experience:
                "Belum pernah memegang tanggung jawab besar."
        },

        leadership: {
            experience: [],
            responsibility:
                "No measurable impact yet",

            impact:
                "Still exploring"
        },

        career: {
            goal:
                "Masih belum tahu ingin berkontribusi di bidang apa.",

            contribution_area:
                "Japan"
        },

        scholarship_preferences: {
            target_countries: [],
            scholarship_type: null,
            priority_factors: []
        }

    },

    // Same scholarship from Assessment 2
    scholarship: {
        name: "LPDP Scholarship"
    }

};


try {

    const matchedMentor =
        matchMentor(
            studentProfile,
            mentors
        );


    if (!matchedMentor) {

        console.log(
            "No mentor found"
        );

        process.exit(1);
    }


    // Only return ONE name
    console.log(
        matchedMentor.name
    );


} catch (error) {

    console.error(
        "Mentor matching failed:"
    );

    console.error(
        error.message
    );

    process.exit(1);
}