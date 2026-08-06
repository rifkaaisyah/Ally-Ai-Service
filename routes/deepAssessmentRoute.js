const express = require("express");

const router = express.Router();


const {
    buildDeepProfile
} = require("../assessment/deepProfileBuilder");



router.post("/deep", (req, res) => {


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



        const profile =
            buildDeepProfile(
                answers,
                uploads || {}
            );



        return res.json({

            status: "success",

            message:
            "Deep scholarship profile generated successfully.",

            data: profile

        });



    } catch(error) {


        console.error(
            "Deep Assessment Error:",
            error
        );


        return res.status(500).json({

            status:"error",

            message:error.message

        });


    }


});



module.exports = router;