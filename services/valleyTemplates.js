/**
 * Valley templates for the scholarship journey.
 *
 * Each valley represents one major preparation phase.
 * The frontend can use these objects to render the
 * gamified journey and checkpoints.
 */

const VALLEY_TEMPLATES = {

    research: {

        id: "research-valley",

        name: "Research Valley",

        objective:
            "Strengthen your research profile and prepare strong evidence of your academic work.",

        checkpoints: [

            {
                id: "research-portfolio",

                title:
                    "Build Your Research Portfolio",

                description:
                    "Organize your research experience, projects, publications and academic achievements.",

                tasks: [

                    {
                        id: "research-collect",

                        title:
                            "Collect your research projects",

                        description:
                            "List the research projects you have participated in.",

                        type: "evidence",

                        completed: false
                    },

                    {
                        id: "research-contribution",

                        title:
                            "Explain your contribution",

                        description:
                            "For each project, explain what you personally contributed.",

                        type: "reflection",

                        completed: false
                    },

                    {
                        id: "research-achievements",

                        title:
                            "Highlight research achievements",

                        description:
                            "Add publications, presentations, awards or other research achievements.",

                        type: "evidence",

                        completed: false
                    }

                ]
            },

            {
                id: "research-proposal",

                title:
                    "Strengthen Your Research Direction",

                description:
                    "Develop a clear research direction that connects your academic background with your future goals.",

                tasks: [

                    {
                        id: "research-topic",

                        title:
                            "Define your research topic",

                        description:
                            "Write a short explanation of the research problem you want to explore.",

                        type: "writing",

                        completed: false
                    },

                    {
                        id: "research-impact",

                        title:
                            "Explain the potential impact",

                        description:
                            "Explain why your research matters and who could benefit from it.",

                        type: "writing",

                        completed: false
                    }

                ]
            }

        ]
    },


    leadership: {

        id: "leadership-valley",

        name: "Leadership Valley",

        objective:
            "Turn your leadership experiences into clear evidence of impact.",

        checkpoints: [

            {
                id: "leadership-evidence",

                title:
                    "Collect Leadership Evidence",

                description:
                    "Document the leadership activities you have participated in.",

                tasks: [

                    {
                        id: "leadership-activities",

                        title:
                            "List your leadership experiences",

                        description:
                            "Write down organizations, projects, teams or initiatives you have led.",

                        type: "evidence",

                        completed: false
                    },

                    {
                        id: "leadership-role",

                        title:
                            "Describe your role",

                        description:
                            "Explain what you were responsible for in each leadership experience.",

                        type: "reflection",

                        completed: false
                    },

                    {
                        id: "leadership-impact",

                        title:
                            "Measure your impact",

                        description:
                            "Add measurable results such as people reached, money raised, projects completed or improvements achieved.",

                        type: "evidence",

                        completed: false
                    }

                ]
            },

            {
                id: "leadership-story",

                title:
                    "Build Your Leadership Stories",

                description:
                    "Prepare strong stories that demonstrate your leadership ability.",

                tasks: [

                    {
                        id: "leadership-star",

                        title:
                            "Write one STAR story",

                        description:
                            "Describe one leadership experience using Situation, Task, Action and Result.",

                        type: "writing",

                        completed: false
                    },

                    {
                        id: "leadership-lesson",

                        title:
                            "Explain what you learned",

                        description:
                            "Explain how the experience changed your leadership approach.",

                        type: "reflection",

                        completed: false
                    }

                ]
            }

        ]
    },


    essay: {

        id: "essay-valley",

        name: "Essay Valley",

        objective:
            "Build strong scholarship essays that clearly connect your experience, goals and chosen scholarship.",

        checkpoints: [

            {
                id: "essay-foundation",

                title:
                    "Find Your Story",

                description:
                    "Identify the experiences that best demonstrate your motivation, leadership and impact.",

                tasks: [

                    {
                        id: "essay-motivation",

                        title:
                            "Why this scholarship?",

                        description:
                            "Write why you want this scholarship and what you hope to achieve.",

                        type: "writing",

                        completed: false
                    },

                    {
                        id: "essay-university",

                        title:
                            "Why this university?",

                        description:
                            "Explain why the university and program are relevant to your goals.",

                        type: "writing",

                        completed: false
                    }

                ]
            },

            {
                id: "essay-star",

                title:
                    "Write With Evidence",

                description:
                    "Turn your experiences into specific and convincing stories.",

                tasks: [

                    {
                        id: "essay-star-story",

                        title:
                            "Write using the STAR method",

                        description:
                            "Rewrite an important experience using Situation, Task, Action and Result.",

                        type: "writing",

                        completed: false
                    },

                    {
                        id: "essay-impact",

                        title:
                            "Add measurable impact",

                        description:
                            "Include concrete outcomes instead of only describing what you did.",

                        type: "writing",

                        completed: false
                    }

                ]
            },

            {
                id: "essay-review",

                title:
                    "Improve Your Draft",

                description:
                    "Review your essay for clarity, evidence and alignment with the scholarship.",

                tasks: [

                    {
                        id: "essay-clarity",

                        title:
                            "Check your story flow",

                        description:
                            "Make sure the essay has a clear beginning, development and conclusion.",

                        type: "review",

                        completed: false
                    },

                    {
                        id: "essay-alignment",

                        title:
                            "Check scholarship alignment",

                        description:
                            "Make sure your experiences and goals directly answer the scholarship criteria.",

                        type: "review",

                        completed: false
                    }

                ]
            }

        ]
    },


    application: {

        id: "application-valley",

        name: "Application Valley",

        objective:
            "Prepare and verify the final scholarship application before submission.",

        checkpoints: [

            {
                id: "application-documents",

                title:
                    "Prepare Your Documents",

                description:
                    "Collect and organize all documents required by the scholarship.",

                tasks: [

                    {
                        id: "application-cv",

                        title:
                            "Update your CV",

                        description:
                            "Make sure your CV reflects your strongest academic, professional and leadership achievements.",

                        type: "document",

                        completed: false
                    },

                    {
                        id: "application-transcript",

                        title:
                            "Prepare academic documents",

                        description:
                            "Collect transcripts, certificates and other academic records.",

                        type: "document",

                        completed: false
                    },

                    {
                        id: "application-recommendation",

                        title:
                            "Prepare recommendation letters",

                        description:
                            "Identify referees and request recommendation letters early.",

                        type: "document",

                        completed: false
                    }

                ]
            },

            {
                id: "application-final-review",

                title:
                    "Final Application Check",

                description:
                    "Review the complete application before submission.",

                tasks: [

                    {
                        id: "application-requirements",

                        title:
                            "Check every requirement",

                        description:
                            "Compare your application against the scholarship requirements.",

                        type: "review",

                        completed: false
                    },

                    {
                        id: "application-proofread",

                        title:
                            "Proofread everything",

                        description:
                            "Check spelling, formatting and consistency across all application materials.",

                        type: "review",

                        completed: false
                    },

                    {
                        id: "application-submit",

                        title:
                            "Submit your application",

                        description:
                            "Submit the completed application before the deadline.",

                        type: "submission",

                        completed: false
                    }

                ]
            }

        ]
    }

};


function getValleyTemplate(type) {

    return VALLEY_TEMPLATES[type] || null;

}


module.exports = {
    VALLEY_TEMPLATES,
    getValleyTemplate
};