const express = require("express");

const router = express.Router();

const {
    generateDashboard
} = require("../services/dashboardService");

router.post("/", (req, res) => {

    try {

        const result =
            generateDashboard(req.body);

        return res.json({

            status: "success",

            message:
                "Dashboard generated successfully.",

            data: result

        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({

            status: "error",

            message: error.message

        });

    }

});

module.exports = router;