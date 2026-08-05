const assessmentConfig = {

    academic: {

        weight: 20,

        questions: {

            q2_gpa_range: {
                "3.75-4.00": 20,
                "3.50-3.74": 17,
                "3.00-3.49": 14,
                "2.50-2.99": 8,
                "below_2.50": 3
            }

        }

    },


    scholarship_goal: {

        weight: 10,

        questions: {

            q5_scholarship_direction: {

                "specific_scholarship": 10,
                "country_university": 8,
                "some_options": 6,
                "no_idea": 3

            }

        }

    },


    leadership: {

        weight: 20,

        questions: {

            q7_leadership_experience: {

                "led_team": 10,
                "organization_member": 7,
                "participant": 4,
                "not_yet": 1

            },


            q8_impact_experience: {

                "led_impact_project": 10,
                "participated_impact_project": 7,
                "volunteer": 4,
                "not_yet": 1

            }

        }

    },


    achievements: {

        weight: 15,

        questions: {

            q10_achievements: {

                "multiple_significant": 15,
                "some_achievements": 10,
                "few_small": 5,
                "not_yet": 0

            }

        }

    },


    english: {

        weight: 15,

        questions: {

            q12_english_certificate: {

                "competitive_score": 15,
                "improve_score": 10,
                "preparing": 6,
                "not_yet": 2

            }

        }

    },


    application: {

        weight: 15,

        questions: {

            q14_cv_status: {

                "ready": 5,
                "needs_improvement": 4,
                "basic": 2,
                "none": 0

            },


            q15_essay_status: {

                "completed_reviewed": 5,
                "not_confident": 4,
                "unfinished": 2,
                "none": 0

            },


            q16_application_knowledge: {

                "understand_process": 5,
                "some_understanding": 3,
                "learning": 2,
                "no_idea": 0

            }

        }

    }

};


module.exports = assessmentConfig;