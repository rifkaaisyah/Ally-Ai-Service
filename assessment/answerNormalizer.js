function normalizeAnswers(answers) {

    const normalized = {};

    const mappings = {

        // Q2 GPA
        "3.75 - 4.00": "3.75-4.00",
        "3.50 - 3.74": "3.50-3.74",
        "3.00 - 3.49": "3.00-3.49",
        "2.50 - 2.99": "2.50-2.99",
        "Below 2.50": "below_2.50",

        // Q5 Scholarship direction
        "Yes, I know the specific scholarship I want":
            "specific_scholarship",

        "I know the country or university but not the scholarship":
            "country_university",

        "I have some options but need recommendations":
            "some_options",

        "I do not know yet":
            "no_idea",

        // Q7 Leadership
        "Yes, I have led a team or project":
            "led_team",

        "Yes, I actively contributed to an organization":
            "organization_member",

        "I participated but did not have a leadership role":
            "participant",

        "Not yet":
            "not_yet",

        // Q8 Impact
        "Yes, I created or led an impact project":
            "led_impact_project",

        "Yes, I participated in an impact project":
            "participated_impact_project",

        "I have volunteered with limited responsibility":
            "volunteer",

        // Q10 Achievements
        "Yes, multiple significant achievements":
            "multiple_significant",

        "Yes, some achievements":
            "some_achievements",

        "A few small achievements":
            "few_small",

        "No significant achievements yet":
            "not_yet",

        // Q12 English
        "Yes, with a competitive score":
            "competitive_score",

        "Yes, but I want to improve my score":
            "improve_score",

        "Preparing but not certified yet":
            "preparing",

        "Not yet":
            "not_yet",

        // Q14 CV
        "Yes, updated and scholarship-ready":
            "ready",

        "I have a basic CV":
            "basic",

        "I have a CV but it needs improvement":
            "needs_improvement",

        "No CV yet":
            "none",

        // Q15 Essay
        "Yes, completed and reviewed":
            "completed_reviewed",

        "I started writing but it is unfinished":
            "unfinished",

        "I have never prepared my story":
            "not_confident",

        "No essay yet":
            "none",

        // Q16 Application knowledge
        "I understand the requirements and application process":
            "understand_process",

        "I understand some requirements but need guidance":
            "some_understanding",

        "I am still learning about the process":
            "learning",

        "I do not know how the application process works":
            "no_idea",

        // Q17 Previous application
        // Currently not scored, but can normalize later if needed.
        
        // Generic existing mappings
        "I do not know yet":
            "no_idea",

        "Not yet developed":
            "not_yet",

        "I have never prepared my story":
            "not_confident",

        "No CV yet":
            "none",

        "No essay yet":
            "none",

        "I do not know where to start":
            "no_idea",

        "Yes, but I was rejected":
            "previous_rejection"
    };

    for (const key in answers) {

        const value = answers[key];

        normalized[key] =
            mappings[value] || value;
    }

    return normalized;
}

module.exports = {
    normalizeAnswers
};