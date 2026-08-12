/**
 * Simple rule-based mentor matching.
 *
 * V1 matching criteria:
 * - study field
 * - career area
 * - scholarship/country experience
 * - leadership experience
 *
 * Returns the highest-scoring mentor.
 */

function matchMentor(profile, mentors = []) {

    if (!profile) {
        throw new Error("Student profile is required");
    }

    if (!Array.isArray(mentors)) {
        throw new Error("Mentors must be an array");
    }

    if (mentors.length === 0) {
        return null;
    }

    const student =
        profile.student_profile || profile;

    const studentStudyField =
        String(
            student.academic?.study_direction ||
            student.study_field ||
            ""
        ).toLowerCase();

    const studentCareerArea =
        String(
            student.career?.contribution_area ||
            ""
        ).toLowerCase();

    const studentNationality =
        String(
            student.nationality ||
            "Indonesia"
        ).toLowerCase();

    const studentLeadership =
        Array.isArray(
            student.leadership?.experience
        ) &&
        student.leadership.experience.length > 0;


    const scoredMentors =
        mentors.map(
            mentor => {

                let score = 0;

                const mentorFields =
                    Array.isArray(mentor.fields)
                        ? mentor.fields
                        : [];

                const mentorCareerAreas =
                    Array.isArray(mentor.career_areas)
                        ? mentor.career_areas
                        : [];

                const mentorCountries =
                    Array.isArray(mentor.countries)
                        ? mentor.countries
                        : [];

                // -----------------------------------------
                // Study field
                // -----------------------------------------

                if (
                    mentorFields.some(
                        field =>
                            String(field)
                                .toLowerCase()
                                .includes(
                                    studentStudyField
                                ) ||
                            studentStudyField.includes(
                                String(field)
                                    .toLowerCase()
                            )
                    )
                ) {

                    score += 4;

                }


                // -----------------------------------------
                // Career area
                // -----------------------------------------

                if (
                    mentorCareerAreas.some(
                        area =>
                            String(area)
                                .toLowerCase()
                                .includes(
                                    studentCareerArea
                                ) ||
                            studentCareerArea.includes(
                                String(area)
                                    .toLowerCase()
                            )
                    )
                ) {

                    score += 3;

                }


                // -----------------------------------------
                // Nationality / regional experience
                // -----------------------------------------

                if (
                    mentorCountries.some(
                        country =>
                            String(country)
                                .toLowerCase()
                                .includes(
                                    studentNationality
                                )
                    )
                ) {

                    score += 2;

                }


                // -----------------------------------------
                // Leadership
                // -----------------------------------------

                if (
                    studentLeadership &&
                    mentor.leadership_experience
                ) {

                    score += 1;

                }


                return {
                    ...mentor,
                    matchScore: score
                };

            }
        );


    // Highest score first

    scoredMentors.sort(
        (a, b) =>
            b.matchScore -
            a.matchScore
    );


    return scoredMentors[0];

}


function rankMentors(
    profile,
    mentors = []
) {

    if (!profile) {
        throw new Error("Student profile is required");
    }

    const student =
        profile.student_profile || profile;

    const studyField =
        String(
            student.academic?.study_direction ||
            ""
        ).toLowerCase();

    const careerArea =
        String(
            student.career?.contribution_area ||
            ""
        ).toLowerCase();

    const ranked =
        mentors.map(
            mentor => {

                let score = 0;

                const fields =
                    mentor.fields || [];

                const careerAreas =
                    mentor.career_areas || [];

                if (
                    fields.some(
                        field =>
                            String(field)
                                .toLowerCase()
                                .includes(studyField) ||
                            studyField.includes(
                                String(field)
                                    .toLowerCase()
                            )
                    )
                ) {

                    score += 4;

                }

                if (
                    careerAreas.some(
                        area =>
                            String(area)
                                .toLowerCase()
                                .includes(careerArea) ||
                            careerArea.includes(
                                String(area)
                                    .toLowerCase()
                            )
                    )
                ) {

                    score += 3;

                }

                if (
                    mentor.leadership_experience
                ) {

                    score += 1;

                }

                return {
                    ...mentor,
                    matchScore: score
                };

            }
        );

    return ranked.sort(
        (a, b) =>
            b.matchScore -
            a.matchScore
    );
}


module.exports = {
    matchMentor,
    rankMentors
};