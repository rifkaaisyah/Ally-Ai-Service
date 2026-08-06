const deepAssessmentConfig = {


    q2_master_motivation: {

        section: "Master's Academic Direction",

        type: "single_choice",

        question:
            "Why do you want to pursue this Master's degree?",

        options: {

            career_advancement:
                "Career advancement",

            research_academic_development:
                "Research and academic development",

            social_problem_solving:
                "Solving a social/community problem",

            career_change:
                "Changing career direction",

            build_specialized_expertise:
                "Building expertise in a specific field",

            other:
                "Other"

        }

    },



    q3_master_plan_clarity: {

        section: "Master's Academic Direction",

        type: "single_choice",

        question:
            "How clear is your Master's study plan?",

        options: {

            exact_program_university:
                "I already know the exact program and universities I want",

            clear_field_researching:
                "I know the field but still researching programs",

            multiple_possible_fields:
                "I have several possible fields",

            exploring:
                "I am still exploring"

        }

    },



    q4_academic_experience: {

        section: "Academic Strength Evidence",

        type: "multiple_choice_upload",

        question:
            "What academic experiences strengthen your Master's application?",

        options: {

            undergraduate_thesis:
                "Undergraduate thesis/final project",

            research_experience:
                "Research experience",

            academic_publication:
                "Academic publication",

            research_assistant:
                "Research assistant experience",

            academic_competition:
                "Academic competition",

            relevant_projects:
                "Relevant coursework/projects",

            none:
                "None yet"

        },

        upload:

            "q4_academic_evidence_upload"

    },



    q5_academic_achievement_description: {

        section: "Academic Strength Evidence",

        type: "open_text",

        question:
            "Describe your strongest academic achievement."

    },



    q6_field_project_experience: {

        section: "Academic Strength Evidence",

        type: "single_choice_upload",

        question:
            "Have you worked on projects related to your intended Master's field?",

        options: {

            multiple_projects:
                "Yes, multiple projects",

            major_project:
                "Yes, one major project",

            coursework_project:
                "Some coursework/project exposure",

            no_related_experience:
                "No related experience yet"

        },

        upload:

            "q6_project_evidence_upload"

    },



    q7_leadership_experience: {

        section: "Leadership and Impact Evidence",

        type: "multiple_choice",

        question:
            "What type of leadership experience do you have?",

        options: {

            student_organization:
                "Student organization leadership",

            research_project_leadership:
                "Research/project leadership",

            community_leadership:
                "Community initiative leadership",

            workplace_team_leadership:
                "Workplace/team leadership",

            event_management:
                "Event/program management",

            none:
                "No leadership experience yet"

        }

    },



    q8_leadership_responsibility: {

        section: "Leadership and Impact Evidence",

        type: "open_text",

        question:
            "What was your biggest responsibility in that experience?"

    },



    q9_leadership_impact: {

        section: "Leadership and Impact Evidence",

        type: "single_choice",

        question:
            "What impact did your activity create?",

        options: {

            community_benefit:
                "Improved or benefited a community/group",

            organization_improvement:
                "Improved an organization/project",

            measurable_result:
                "Created measurable results",

            personal_team_growth:
                "Personal/team development only",

            no_measurable_impact:
                "No measurable impact yet"

        }

    },



    q10_career_goal: {

        section: "Career Vision and Motivation",

        type: "single_choice",

        question:
            "What do you want to achieve after completing your Master's degree?",

        options: {

            specialist_professional:
                "Become a specialist/professional in my field",

            phd_research:
                "Continue research/PhD",

            entrepreneur:
                "Build a company/startup",

            government_public_sector:
                "Work in government/public sector",

            social_impact:
                "Create social impact",

            exploring:
                "Still exploring"

        }

    },



    q11_career_contribution_area: {

        section: "Career Vision and Motivation",

        type: "open_text",

        question:
            "What problem or area do you want to contribute to through your career?"

    },



    q12_target_countries: {

        section: "Scholarship Preference",

        type: "multiple_choice",

        question:
            "Which countries are you interested in for your Master's study?",

        options: {

            indonesia:
                "Indonesia",

            japan:
                "Japan",

            south_korea:
                "South Korea",

            germany:
                "Germany",

            uk:
                "United Kingdom",

            usa:
                "United States",

            australia:
                "Australia",

            turkey:
                "Türkiye",

            any_country:
                "Any country with suitable scholarship opportunities"

        }

    },



    q13_scholarship_type: {

        section: "Scholarship Preference",

        type: "single_choice",

        question:
            "What type of scholarship are you looking for?",

        options: {

            fully_funded:
                "Fully funded scholarship",

            tuition_only:
                "Tuition scholarship",

            research_funding:
                "Research funding",

            university_scholarship:
                "University scholarship",

            any:
                "Any suitable opportunity"

        }

    },



    q14_scholarship_priority: {

        section: "Scholarship Preference",

        type: "ranking",

        question:
            "What factors are most important when choosing a scholarship?",

        options: [

            "funding",

            "university_reputation",

            "research",

            "career",

            "country",

            "alumni",

            "program_fit"

        ]

    },



    q15_cv_strength: {

        section: "Application Material Readiness",

        type: "single_choice",

        question:
            "How strong is your current CV/resume?",

        options: {

            achievement_based:
                "Professional CV with achievements and measurable results",

            good_needs_improvement:
                "Good CV but needs improvement",

            basic:
                "Basic CV containing education and activities",

            none:
                "No CV yet"

        }

    },



    q16_essay_readiness: {

        section: "Application Material Readiness",

        type: "single_choice",

        question:
            "How prepared is your scholarship essay/personal statement?",

        options: {

            clear_story:
                "I have a clear story and draft",

            needs_structure:
                "I have ideas but need structure",

            difficult_storytelling:
                "I struggle explaining my journey",

            not_started:
                "I have not started"

        }

    },



    q17_recommendation_availability: {

        section: "Application Material Readiness",

        type: "single_choice",

        question:
            "Do you already have potential recommendation letter providers?",

        options: {

            available:
                "Yes, professors/supervisors are available",

            possible_not_contacted:
                "I know possible people but have not contacted them",

            need_guidance:
                "I do not know who to ask yet"

        }

    },



    q18_preparation_time: {

        section: "Preparation Timeline",

        type: "single_choice",

        question:
            "How much time can you dedicate to scholarship preparation weekly?",

        options: {

            more_than_10_hours:
                "More than 10 hours/week",

            five_to_ten_hours:
                "5-10 hours/week",

            one_to_five_hours:
                "1-5 hours/week",

            limited:
                "Very limited time"

        }

    },



    q19_application_deadline_target: {

        section: "Preparation Timeline",

        type: "single_choice",

        question:
            "When do you realistically want to submit your first Master's scholarship application?",

        options: {

            within_3_months:
                "Within 3 months",

            three_to_six_months:
                "Within 3-6 months",

            six_to_twelve_months:
                "Within 6-12 months",

            more_than_one_year:
                "More than 1 year"

        }

    },



    q20_support_needed: {

        section: "Ally Support Preference",

        type: "multiple_choice",

        question:
            "What support do you need most from Ally?",

        options: {

            scholarship_search:
                "Find suitable Master's scholarships",

            profile_improvement:
                "Improve my profile competitiveness",

            roadmap:
                "Build scholarship preparation timeline",

            cv_help:
                "Improve my CV",

            essay_help:
                "Develop scholarship essays",

            interview_help:
                "Prepare scholarship interviews",

            mentor:
                "Connect with a human mentor"

        }

    }


};


module.exports = deepAssessmentConfig;