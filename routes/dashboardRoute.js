const express = require("express");

const router = express.Router();

const {
    generateDashboard
} = require("../services/dashboardService");


router.post("/", async (req, res) => {

    try {

        const {
            answers,
            uploads
        } = req.body;


        if (!answers) {

            return res.status(400).json({

                status: "error",

                message:
                    "Assessment answers are required"

            });

        }


        const result =
            await generateDashboard({

                answers,

                uploads: uploads || {}

            });


        return res.json({

            status: "success",

            message:
                "Dashboard generated successfully.",

            data: result

        });

    }
    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        return res.status(500).json({

            status: "error",

            message: error.message

        });

    }

});


module.exports = router;