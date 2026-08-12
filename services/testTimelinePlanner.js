const {
    planTimeline
} = require("./timelinePlanner");


const journey = {

    scholarship: {

        id: "chevening-001",

        name: "Chevening Scholarship",

        deadline: {

            application_period:
                "30 June - 31 July 2027"

        }

    },


    readiness: 87,


    valleys: [

        {

            id: "research-valley",

            name: "Research Valley",

            status: "current",

            checkpoints: [

                {

                    id: "research-portfolio",

                    tasks: [

                        {
                            id: "research-collect",
                            completed: true
                        },

                        {
                            id: "research-contribution",
                            completed: false
                        },

                        {
                            id: "research-achievements",
                            completed: false
                        }

                    ]

                },

                {

                    id: "research-proposal",

                    tasks: [

                        {
                            id: "research-topic",
                            completed: false
                        },

                        {
                            id: "research-impact",
                            completed: false
                        }

                    ]

                }

            ]

        },


        {

            id: "leadership-valley",

            name: "Leadership Valley",

            status: "locked",

            checkpoints: []

        }

    ]

};


const today =
    new Date(
        2026,
        7,
        12
    );


const result =
    planTimeline(
        journey,
        today
    );


console.log(
    JSON.stringify(
        result.timeline,
        null,
        2
    )
);