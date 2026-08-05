function createScholarshipChunks(scholarships) {
  return scholarships.map((scholarship) => {

    const text = `
Scholarship Name:
${scholarship.name}

Provider:
${scholarship.provider}

Country:
${scholarship.country}

Study Levels:
${scholarship.study_levels.join(", ")}

Fields of Study:
${scholarship.fields_of_study.join(", ")}

Requirements:
Nationality:
${scholarship.requirements.nationality}

Leadership Required:
${scholarship.requirements.leadership_required}

Community Service Required:
${scholarship.requirements.community_service_required}

Ideal Candidates:
${scholarship.ideal_candidates.join(", ")}

Benefits:
${scholarship.benefits.join(", ")}

Keywords:
${scholarship.keywords.join(", ")}

Description:
${scholarship.description}
`;

    return {
    id: scholarship.id,

    text: text.trim(),

    metadata: {
        name: scholarship.name,
        country: scholarship.country,
        study_levels: scholarship.study_levels,
        fields_of_study: scholarship.fields_of_study
    },

    requirements: scholarship.requirements,

    fields_of_study: scholarship.fields_of_study,

    profile_tags: scholarship.profile_tags
};
  });
}


module.exports = {
  createScholarshipChunks
};