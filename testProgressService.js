const {
    updateJourneyProgress
} = require("./services/progressService");

const journey = {
    scholarship: {
        id: "chevening-001",
        name: "Chevening Scholarship"
    },

    strategy: "current_cycle",

    feasibility: "high",

    urgency: "medium",

    readiness: 87,

    valleys: [
        {
            id: "research-valley",
            name: "Research Valley",

            checkpoints: [
                {
                    id: "research-portfolio",

                    title: "Build Your Research Portfolio",

                    tasks: [
                        {
                            id: "research-collect",
                            title: "Collect your research projects",
                            completed: false
                        },
                        {
                            id: "research-contribution",
                            title: "Explain your contribution",
                            completed: false
                        },
                        {
                            id: "research-achievements",
                            title: "Highlight research achievements",
                            completed: false
                        }
                    ]
                }
            ]
        },

        {
            id: "leadership-valley",
            name: "Leadership Valley",

            checkpoints: [
                {
                    id: "leadership-evidence",

                    title: "Collect Leadership Evidence",

                    tasks: [
                        {
                            id: "leadership-activities",
                            title: "List your leadership experiences",
                            completed: false
                        },
                        {
                            id: "leadership-impact",
                            title: "Measure your impact",
                            completed: false
                        }
                    ]
                }
            ]
        }
    ]
};


/*
 * Student has completed two research tasks.
 */
const completedTaskIds = [
    "research-collect",
    "research-contribution",
    "research-achievements"
];

const result =
    updateJourneyProgress(
        journey,
        completedTaskIds
    );


console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);