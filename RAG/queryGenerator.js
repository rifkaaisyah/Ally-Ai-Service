function generateScholarshipQuery(profile) {


const query = `

Scholarship Matching Request

Student nationality:
${profile.nationality || "Not specified"}

Education level:
${profile.education_level}

Academic strength:
${profile.academic_profile.academic_strength}

GPA:
${profile.academic_profile.gpa_range}

Undergraduate field:
${profile.study_field}

Master's intended field:
${profile.master_direction}

Leadership experience:
${profile.leadership}

Community and social impact:
${profile.impact}

English preparation:
${profile.english}

Application readiness:
CV:
${profile.application_readiness.cv}

Essay:
${profile.application_readiness.essay}


Find fully funded Master's scholarships.

Prioritize:
- nationality eligibility
- field of study match
- leadership requirements
- community impact requirements
- academic excellence
- scholarship funding type

`;

return query.trim();

}


module.exports = {
    generateScholarshipQuery
};