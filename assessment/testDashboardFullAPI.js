async function testDashboardFullAPI() {

    try {

        const response =
            await fetch(
                "http://localhost:3001/api/dashboard",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        answers: {

                            q2_master_motivation:
                                "I want to pursue a Master's degree to deepen my expertise and contribute to Artificial Intelligence research.",

                            q3_master_plan_clarity:
                                "Very Clear",

                            q4_academic_experience: [
                                "research_experience",
                                "academic_project"
                            ],

                            q5_academic_achievement_description:
                                "Completed AI research projects and achieved strong academic results.",

                            q6_field_project_experience:
                                "multiple",

                            q7_leadership_experience: [
                                "Student Organization"
                            ],

                            q8_leadership_responsibility:
                                "Led a student organization and coordinated team activities.",

                            q9_leadership_impact:
                                "Led 20 members and organized multiple academic activities.",

                            q10_career_goal:
                                "Become an AI researcher and contribute to responsible AI development.",

                            q11_career_contribution_area:
                                "Artificial Intelligence",

                            q12_target_countries: [
                                "Japan",
                                "Germany"
                            ],

                            q13_scholarship_type:
                                "Fully Funded",

                            q14_scholarship_priority: [
                                "Funding",
                                "University quality",
                                "Research opportunities"
                            ],

                            q15_cv_strength:
                                "Good",

                            q16_essay_readiness:
                                "Draft Ready",

                            q17_recommendation_availability:
                                "Available",

                            q18_preparation_time:
                                "10 hours per week",

                            q19_application_deadline_target:
                                "Within 6 months",

                            q20_support_needed: [
                                "Scholarship matching",
                                "Essay preparation",
                                "Application planning"
                            ]

                        },

                        uploads: {

                            q4_academic_evidence_upload:
                                null,

                            q6_project_evidence_upload:
                                null

                        }

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "HTTP STATUS:",
            response.status
        );


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


    }
    catch (error) {

        console.error(
            "Dashboard Test Error:",
            error.message
        );

    }

}


testDashboardFullAPI();